import React, { useState, useEffect } from 'react';
import { Plus, PencilIcon, TrashIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { auth } from "firebaseConfig";
import { Timestamp } from 'firebase/firestore';
import PostModal from 'common/components/postModal/PostModal';

/**
 * PostSection Component
 * 
 * Parameters:
 * - posts 
 * - editMode (Boolean): A flag that determines whether the component is in edit mode. If true, it shows a form to add or edit an experience.
 * - onEditModeChange (Function): A callback function to handle toggling between edit and view mode. 
 *   It takes a boolean value (true/false) as an argument. True Edit, False no Edit
 * - onPostDataChange (Function): A callback function that handles changes to the post data (e.g., title, content, etc.). It is passed to the PostForm component to update the post data.
 * - onAddPost (Function): A callback function triggered when a new post is created. 
 *   It receives the post data as an argument.
 * - onDeletePost (Function): A callback function triggered when a post is deleted. 
 *   It receives the post's id to remove the specific post from the list.
 * Description:
 * This component manages the rendering and editing of posts. 
 * It provides functionality to view existing posts, create a new one and edit or delete existing posts. 
 */

export const PostSection = ({
    posts: initialPosts,
    editMode,
    onEditModeChange,
    onPostDataChange,
    onAddPost,
    onDeletePost
}) => {
    const [selectedPost, setSelectedPost] = useState(null);
    const [localPosts, setLocalPosts] = useState(initialPosts);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    useEffect(() => {
        setLocalPosts(initialPosts);
    }, [initialPosts]);

    useEffect(() => {
        const checkScroll = () => {
            const container = document.querySelector('.posts-scroll-container');
            if (container) {
                // Check if we can scroll left
                setCanScrollLeft(container.scrollLeft > 0);

                // Check if we can scroll right
                const canScroll = container.scrollWidth > container.clientWidth;
                const isAtEnd = Math.ceil(container.scrollLeft + container.clientWidth) >= container.scrollWidth;
                setCanScrollRight(canScroll && !isAtEnd);
            }
        };

        const container = document.querySelector('.posts-scroll-container');
        if (container) {
            container.addEventListener('scroll', checkScroll);
            // Initial check
            checkScroll();

            // Also check when window is resized
            window.addEventListener('resize', checkScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', checkScroll);
                window.removeEventListener('resize', checkScroll);
            }
        };
    }, [localPosts]);

    const handleEditClick = (post) => {
        setSelectedPost(post);
        onEditModeChange(true);
    };

    const handleCancel = () => {
        setSelectedPost(null);
        onEditModeChange(false);
    };

    const handleDeletePost = (postId) => {
        setLocalPosts((prevPosts) =>
            prevPosts.filter((post) => post.id !== postId)
        );
        onDeletePost(postId);
    };

    const handleScroll = (direction) => {
        const container = document.querySelector('.posts-scroll-container');
        const scrollAmount = 300; // Adjust this value based on your needs
        if (container) {
            const newPosition = direction === 'left'
                ? Math.max(0, scrollPosition - scrollAmount)
                : scrollPosition + scrollAmount;

            container.scrollTo({
                left: newPosition,
                behavior: 'smooth'
            });
            setScrollPosition(newPosition);
        }
    };

    return (
        <div className="post-section">
            <div className="section-header">
                <h2>Posts</h2>
                <button
                    onClick={() => {
                        setSelectedPost(null);
                        onEditModeChange(true);
                    }}
                    className="add-btn"
                >
                    <Plus size={16} /> Add Post
                </button>
            </div>

            {editMode && (
                <PostForm
                    post={selectedPost || {}}
                    onPostDataChange={onPostDataChange}
                    onSave={(postData) => {
                        onAddPost(postData);
                        setSelectedPost(null);
                        onEditModeChange(false);
                    }}
                    onCancel={handleCancel}
                />
            )}

            <div className="posts-container">
                <div className="posts-scroll-container">
                    <PostList
                        posts={localPosts}
                        onEdit={handleEditClick}
                        onDelete={handleDeletePost}
                    />
                </div>

                <button
                    className={`scroll-button scroll-left ${canScrollLeft ? 'visible' : ''}`}
                    onClick={() => handleScroll('left')}
                    aria-hidden={!canScrollLeft}
                >
                    <ChevronLeft size={24} />
                </button>

                <button
                    className={`scroll-button scroll-right ${canScrollRight ? 'visible' : ''}`}
                    onClick={() => handleScroll('right')}
                    aria-hidden={!canScrollRight}
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};

const PostForm = ({ post, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        ...post,
    });

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        // Check the value of formData.endDate before creating the Timestamp 
        const createdAt = Timestamp.now().toDate();

        // Debug time but its since 1970
        // Further converted to readable time
        console.log('createdAt:', createdAt);

        // Construct postData object
        const postData = {
            ...formData,
            createdAt: createdAt,  // Using the createdAt that was just logged
            commentCount: formData.commentCount || 0,
            likeCount: formData.likeCount || 0,
            userId: auth.currentUser.uid,
            id: formData.id || ''
        };
        onSave(postData);
    };

    return (
        <div className="post-form">
            <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Title"
                className="form-input"
            />
            <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Content"
                className="form-textarea"
            />
            <div className="form-actions">
                <button onClick={onCancel} className="cancel-button">Cancel</button>
                <button onClick={handleSave} className="save-button">Save</button>
            </div>
        </div>
    );
};

const PostList = ({ posts, onEdit, onDelete }) => {
    const [selectedPost, setSelectedPost] = useState(null);
    if (!Array.isArray(posts) || posts.length === 0) {
        return <p className="empty-message">No posts available</p>;
    }
    const handlePostClick = (post) => {
        setSelectedPost(post.id);
    };

    return (
        <div className="post-list">
            {posts.map((post) => (
                <div
                    key={post.id}
                    className="post-card"
                    onClick={(e) => {
                        // Prevent click if user clicked on edit/delete buttons
                        if (!e.target.closest('.post-card-actions')) {
                            handlePostClick(post);
                        }
                    }}
                >
                    <div className="card-header">
                        <h3 className="post-title">{post.title}</h3>
                        <div className="post-card-actions">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(post);
                                }}
                                className="action-button edit-post-button"
                            >
                                <PencilIcon size={16} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(post.id);
                                }}
                                className="action-button delete-post-button"
                            >
                                <TrashIcon size={16} />
                            </button>
                        </div>
                    </div>
                    <p className="content">{post.content}</p>
                    <div className="card-footer">
                        <span>Comments: {post.commentCount}</span>
                        <span>Likes: {post.likeCount}</span>
                    </div>
                </div>
            ))}

            {selectedPost && (
                <PostModal
                    postId={selectedPost}
                    collectionName="posts"
                    onClose={() => setSelectedPost(null)}
                />
            )}
        </div>
    );
};
export default PostSection;