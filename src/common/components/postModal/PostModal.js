import React, { useState, useEffect } from 'react';
import { doc, collection, query, where, getDocs, addDoc, Timestamp, orderBy, getDoc } from 'firebase/firestore';
import { db, auth } from 'firebaseConfig';
import { Heart, X, Trash2, Edit2, MessageCircle } from 'lucide-react';
import './PostModal.css';
import { useFirebaseUpload, useFirebaseDocument } from 'common/hooks/useFirebase';
import DefaultProfilePic from 'common/images/placeholderPic.jpg';

const PostModal = ({ postId, collectionName, onClose }) => {
    const { updateDocument, getDocument, deleteDocument } = useFirebaseDocument('posts');
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userMap, setUserMap] = useState({});

    useEffect(() => {
        fetchPostData();
        checkIfLiked();
        fetchComments();
    }, [postId]);

    const fetchUserFirstNameById = async (userId) => {
        try {
            const userData = await getDocument('users', userId);
            return userData ? userData.firstName : null;
        } catch (error) {
            console.error(`Error fetching user ${userId}:`, error);
            return null;
        }
    };

    useEffect(() => {
        const fetchUserFirstNames = async () => {
            const uniqueUserIds = [...new Set(comments.map(comment => comment.userId))];
            const userNamePromises = uniqueUserIds.map(async (userId) => {
                const firstName = await fetchUserFirstNameById(userId);
                return { userId, firstName };
            });

            const users = await Promise.all(userNamePromises);
            const userMap = users.reduce((map, user) => {
                if (user.firstName) map[user.userId] = user.firstName;
                return map;
            }, {});
            setUserMap(userMap);
        };

        if (comments.length > 0) {
            fetchUserFirstNames();
        }
    }, [comments, getDocument]);

    const fetchPostData = async () => {
        try {
            console.log("Data in fetch Post Data in Post Modal: colection", collectionName,"postId", postId,"--")
            const postData = await getDocument(collectionName, postId);
            setPost(postData);
        } catch (error) {
            console.error('Error fetching post data:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkIfLiked = async () => {
        if (!auth.currentUser) return;

        try {
            const likesRef = collection(db, 'postLikes');
            const q = query(
                likesRef,
                where('userId', '==', auth.currentUser.uid),
                where('postId', '==', postId)
            );
            const snapshot = await getDocs(q);
            setIsLiked(!snapshot.empty);
        } catch (error) {
            console.error('Error checking like status:', error);
        }
    };

    const handleLike = async () => {
        if (!auth.currentUser) return;

        try {
            const likesRef = collection(db, 'postLikes');
            if (!isLiked) {
                await addDoc(likesRef, {
                    userId: auth.currentUser.uid,
                    postId
                });
                await updateDocument(collectionName, postId, {
                    likeCount: (post.likeCount || 0) + 1
                });
                setIsLiked(true);
                setPost(prev => ({ ...prev, likeCount: (prev.likeCount || 0) + 1 }));
            }
        } catch (err) {
            setError('Failed to update like status');
            console.error('Error liking the post:', err);
        }
    };

    const fetchComments = async () => {
        try {
            const commentsRef = collection(db, 'comments');
            const q = query(commentsRef, where('postId', '==', postId));
            const snapshot = await getDocs(q);
            const commentsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setComments(commentsData.sort((a, b) => b.created_at - a.created_at));
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !auth.currentUser) return;

        try {
            const commentRef = collection(db, 'comments');
            const newCommentData = {
                postId,
                userId: auth.currentUser.uid,
                content: newComment,
                created_at: Timestamp.now(),
            };

            await addDoc(commentRef, newCommentData);
            await updateDocument(collectionName, postId, {
                commentCount: (post.commentCount || 0) + 1,
            });

            setPost(prev => ({
                ...prev,
                commentCount: (prev.commentCount || 0) + 1,
            }));

            setNewComment('');
            fetchComments();
        } catch (err) {
            setError('Failed to add comment');
            console.error('Error adding comment:', err);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                const result = await deleteDocument('comments', commentId);
                if (!result.success) {
                    setError('Failed to delete comment');
                    return;
                }

                const postRef = doc(db, 'posts', postId);
                const postDoc = await getDoc(postRef);

                if (postDoc.exists()) {
                    const currentCount = postDoc.data().commentCount || 0;
                    await updateDocument('posts', postId, {
                        commentCount: Math.max(currentCount - 1, 0),
                    });

                    setPost((prev) => ({
                        ...prev,
                        commentCount: Math.max((prev.commentCount || 0) - 1, 0),
                    }));
                }

                setComments((prev) => prev.filter((comment) => comment.id !== commentId));
            } catch (err) {
                setError('Failed to delete comment');
                console.error('Error deleting comment:', err);
            }
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                const result = await deleteDocument(collectionName, postId);
                if (result.success) {
                    onClose();
                } else {
                    setError('Failed to delete post');
                }
            } catch (error) {
                setError('Failed to delete post');
                console.error('Error deleting post:', error);
            }
        }
    };



    if (loading) return <div className="modal-overlay"><div className="loading">Loading...</div></div>;
    if (!post) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-post-content">
                <button className="close-button" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="post-header">
                    <h2>{post.title}</h2>
                    {auth.currentUser?.uid === post.userId && (
                        <div className="post-actions">
                            <button className="icon-button">
                                <Edit2 size={20} />
                            </button>
                            <button className="icon-button delete" onClick={handleDelete}>
                                <Trash2 size={20} />
                            </button>
                        </div>
                    )}
                </div>

                {post.imageUrl && (
                    <div className="post-image">
                        <img src={post.imageUrl} alt={post.title} />
                    </div>
                )}

                <div className="post-content">{post.content}</div>

                <div className="post-interactions">
                    <button
                        className={`like-button ${isLiked ? "liked" : ""}`}
                        onClick={handleLike}
                    >
                        <Heart size={20} />
                        <span>{post.likeCount || 0}</span>
                    </button>

                    <div className="comment-section">
                        <MessageCircle size={20} />
                        <span>{comments.length} Comments</span>
                    </div>
                </div>

                {auth.currentUser && (
                    <form className="comment-form" onSubmit={handleAddComment}>
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                        />
                        <button type="submit">Post</button>
                    </form>
                )}

                <div className="comments-list">
                    {comments.map((comment) => {
                        const firstName = userMap[comment.userId]; // Get firstName from userMap
                        return (
                            <div key={comment.id} className="comment">
                                <div className="comment-header">
                                    <div>
                                        <strong>
                                            {auth.currentUser?.uid === comment.userId
                                                ? 'You'
                                                : firstName || 'Anonymous'}
                                        </strong>
                                        <span className="comment-date">
                                            {comment.created_at.toDate().toLocaleDateString()}
                                        </span>
                                    </div>
                                    {auth.currentUser?.uid === comment.userId && (
                                        <button className="delete-comment" onClick={() => handleDeleteComment(comment.id)}>
                                            Delete
                                        </button>
                                    )}
                                </div>
                                <p className="comment-content">{comment.content}</p>
                            </div>
                        );
                    })}
                </div>

                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    );
};

export default PostModal;