import React from 'react';
import { Heart, MessageCircle, Share2, Image as ImageIcon } from 'lucide-react';
import '../styles/PostCard.css';

// Individual PostCard Component
const PostCard = ({ post }) => {
  const formatDate = (timestamp) => {
    if (!timestamp) {
      return "N/A";  // If timestamp is undefined or null, return "N/A"
    }

    // Check if the timestamp is a Firebase Timestamp, then convert it to a Date object
    const date = timestamp instanceof Date ? timestamp : timestamp.toDate();

    // Format the Date object
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
    <div className="post-card">
      {/* Image Section */}
      <div className="post-image-container">
        {post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt="Post"
            className="post-image"
          />
        ) : (
          <div className="placeholder-icon">
            <ImageIcon size={48} />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="post-content">
        <div className="post-header">
          <h3>{post.title || 'Untitled Post'}</h3>
          <span id='date-post'>{formatDate(post.createdAt)}</span>
        </div>

        <p className="post-text">
          {truncateText(post.content)}
        </p>

        {/* Actions */}
        <div className="post-footer">
          <div className="post-actions">
            <button className="action-button">
              <Heart size={16} />
              <span>{post.likeCount || 0}</span>
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
  );
};

// PostList Component with horizontal scroll
const PostList = ({ posts, loading }) => {
  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-gray-500">Loading posts...</div>
      </div>
    );
  }

  if (!posts?.length) {
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
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export { PostCard, PostList };
