import React, { useState } from 'react';
import { X } from 'lucide-react';
import { auth, db, storage } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import '../styles/CreatePostPopup.css';

const CreatePostPopup = ({ isOpen, onClose, onPostCreated }) => {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);
        try {
            let imageUrl = '';
            if (image) {
                const imageRef = ref(storage, `post-images/${auth.currentUser.uid}/${Date.now()}`);
                await uploadBytes(imageRef, image);
                imageUrl = await getDownloadURL(imageRef);
            }

            const postData = {
                userId: auth.currentUser.uid,
                content,
                imageUrl,
                timestamp: serverTimestamp(),
                likes: 0,
                comments: []
            };

            const docRef = await addDoc(collection(db, "posts"), postData);
            setContent('');
            setImage(null);
            onPostCreated();
            onClose();
        } catch (error) {
            console.error("Error creating post:", error);
        } finally {
            setIsSubmitting(false);
        }
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