import React, { useState } from 'react';
import { X } from 'lucide-react';
import { auth, db, storage } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import '../styles/CreatePostPopup.css';

const CreatePostPopup = ({ isOpen, onClose, onPostCreated }) => {
    const [title, setTitle] = useState('');  // Added title field
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleImageChange = (e) => {
        e.preventDefault();
        setError('');
        
        if (!content.trim()) {
            setError('Post content is required');
            return;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);
        try {
            // Ensure we have the current user
            const currentUser = auth.currentUser;
            if (!currentUser) {
                throw new Error('User not authenticated');
            }

            let imageUrl = '';
            if (image) {
                const imageRef = ref(storage, `post-images/${currentUser.uid}/${Date.now()}`);
                await uploadBytes(imageRef, image);
                imageUrl = await getDownloadURL(imageRef);
            }

            const postData = {
                userId: currentUser.uid,
                authorName: currentUser.displayName || 'Anonymous',
                authorPhotoURL: currentUser.photoURL || '',
                title: title.trim(),
                content: content.trim(),
                imageUrl,
                timestamp: serverTimestamp(),
                likeCount: 0,
                commentCount: 0,
                createdAt: new Date().toISOString()
            };

            const docRef = await addDoc(collection(db, "posts"), postData);
            console.log("Post created with ID:", docRef.id);

            // Clear form and close popup
            setTitle('');
            setContent('');
            setImage(null);
            onPostCreated();
            onClose();
        } catch (error) {
            console.error("Error creating post:", error);
            setError('Failed to create post. Please try again.');
        } finally {
            setIsSubmitting(false);
        } setIsSubmitting(false);
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <div className="popup-header">
                    <h2>Create a post</h2>
                    <button onClick={onClose} className="close-button">
                        <X size={24} />
                    </button>
                </div>
                <input className="post-form"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Post title"
                    />

                <form onSubmit={handleSubmit} className="post-form">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What do you want to share?"
                        className="post-input"
                    />

                    <div className="post-actions">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            id="image-upload"
                            className="hidden"
                        />
                        <label htmlFor="image-upload" className="image-upload-button">
                            Add Image
                        </label>

                        <button
                            type="submit"
                            disabled={!content.trim() || isSubmitting}
                            className="post-button"
                        >
                            {isSubmitting ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePostPopup;