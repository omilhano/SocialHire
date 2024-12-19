import React from 'react';
import { X, Heart, MessageCircle, Trash2, Edit2 } from 'lucide-react';
import 'components/postModal/PostModal.css';

const PostModal = ({  postId, collectionName, onClose  }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-post-content">
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="post-header">
          <h2>Post Title</h2>
          <div className="post-actions">
            <button className="icon-button">
              <Edit2 size={20} />
            </button>
            <button className="icon-button delete">
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        <div className="post-image">
          <img src="https://via.placeholder.com/300" alt="Post" />
        </div>

        <div className="post-content">
          <p>This is a placeholder for the post content.</p>
        </div>

        <div className="post-footer">
          <div className="post-actions">
            <button className="action-button">
              <Heart size={16} />
              <span>12</span>
            </button>
            <button className="action-button">
              <MessageCircle size={16} />
              <span>3</span>
            </button>
          </div>
        </div>

        <div className="comments-section">
          <h3>Comments</h3>
          <div className="comment">
            <p><strong>User:</strong> This is a comment.</p>
          </div>
          <div className="comment-input">
            <input type="text" placeholder="Add a comment..." />
            <button>Add</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
