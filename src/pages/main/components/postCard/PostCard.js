import React, { useState, useEffect } from 'react';
import PostModal from 'common/components/postModal/PostModal.js';
import TipoPostCard from '../TipoPostCard.js';

import { Heart, MessageCircle, Share2, Image as ImageIcon } from 'lucide-react';
import './PostCard.css';
import { useFirebaseUpload, useFirebaseDocument } from 'common/hooks/useFirebase';
import { db, auth } from 'firebaseConfig';
import { doc, collection, query, where, getDocs, addDoc, Timestamp, orderBy, getDoc } from 'firebase/firestore';

// Individual PostCard Component
const PostCard = ({ post }) => {
  const { updateDocument, getDocument, deleteDocument } = useFirebaseDocument('posts');
  const [likes, setLikes] = useState(post.likeCount || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(`PostCard mounted for post ID: ${post.id}`);
    checkIfLiked();
    return () => {
      console.log(`PostCard unmounted for post ID: ${post.id}`);
    };
  }, [post.id]);

  const checkIfLiked = async () => {
    console.log('Checking if the post is liked...');
    if (!auth.currentUser) {
      console.log('User is not logged in.');
      return;
    }

    try {
      const likesRef = collection(db, 'postLikes');
      const q = query(
        likesRef,
        where('userId', '==', auth.currentUser.uid),
        where('postId', '==', post.id)
      );
      const snapshot = await getDocs(q);
      setIsLiked(!snapshot.empty);
    } catch (err) {
      console.error('Error checking like status:', err);
    }
  };

  const handleLike = async () => {
    console.log('Like button clicked for post ID:', post.id);
    if (!auth.currentUser) {
      console.warn('User is not logged in. Cannot like the post.');
      return;
    }

    try {
      const likesRef = collection(db, 'postLikes');
      if (!isLiked) {
        console.log('Adding like to the database...');
        await addDoc(likesRef, {
          userId: auth.currentUser.uid,
          postId: post.id
        });
        console.log('Updating like count in the posts collection...');
        await updateDocument("posts", post.id, {
          likeCount: (post.likeCount || 0) + 1
        });
        setIsLiked(true);
        setLikes(prev => prev + 1);
      } else {
        console.log('Already liked. Skipping like update.');
      }
    } catch (err) {
      console.error('Failed to update like status:', err);
      setError('Failed to update like status');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp instanceof Date ? timestamp : timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <>
      <div className="post-card">
        <div className="post-image-container">
          {post.imageUrl ? (
            <img src={post.imageUrl} alt="Post" className="post-image" />
          ) : (
            <div className="placeholder-icon">
              <ImageIcon size={48} />
            </div>
          )}
        </div>

        <div className="post-content">
          <div className="post-header">
            <h3>{post.title || 'Untitled Post'}</h3>
            <span id="date-post">{formatDate(post.createdAt)}</span>
          </div>

          <p className="post-text">{truncateText(post.content)}</p>

          <div className="post-footer">
            <div className="post-actions">
              <button
                className={`like-button ${isLiked ? "liked" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
              >
                <Heart size={16} />
                <span>{likes}</span>
              </button>
              <button className="action-button">
                <MessageCircle size={16} />
                <span>{post.commentCount || 0}</span>
              </button>
              <button className="action-button">
                <Share2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>


    </>
  );
};

// PostList Component
const PostList = ({ posts, loading }) => {
  const [selectedPost, setSelectedPost] = useState(null);

  const handlePostClick = (post) => {
    console.log('Post clicked with ID:', post.id);
    setSelectedPost(post.id);
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-gray-500">Loading posts...</div>
      </div>
    );
  }

  if (!posts?.length) {
    console.log('No posts available.');
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center text-gray-500">
        <MessageCircle size={32} />
        <p className="mt-2">No posts yet</p>
      </div>
    );
  }


  return (
    <div className="posts-scroll">
      <div className="flex space-x-4 px-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="post-card-out"
            onClick={(e) => {
 //             if (!e.target.closest('.post-card-actions')) {
                handlePostClick(post);
 //             }
            }}
          >
            <PostCard key={post.id} post={post} />
          </div>
        ))}
      </div>

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

export { PostCard, PostList };
