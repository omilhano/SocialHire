import React from "react";
import { Card, Button } from "react-bootstrap";
import "../../styles/UserPostsSection.css";

export const UserPostsSection = ({ posts, editMode, onDeletePost }) => {
  return (
    <div className="user-posts-section">
      <h3 className="section-title">Posts</h3>
      <div className="posts-container">
        {posts.length === 0 ? (
          <p className="no-posts-message">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="post-card shadow-sm">
              <Card.Body>
                <Card.Title className="post-title">{post.title}</Card.Title>
                <Card.Text className="post-content">{post.content}</Card.Text>
              </Card.Body>
              {editMode && (
                <Card.Footer>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDeletePost(post.id)}
                  >
                    Delete Post
                  </Button>
                </Card.Footer>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
