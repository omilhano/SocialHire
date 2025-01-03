import React from "react";
import { Card, Button } from "react-bootstrap";
import "./UserPostsSection.css";

/**
 * UserPostsSection Component
 * 
 * This component displays a list of user posts. Each post is displayed in a Bootstrap Card with its title
 * and content. If the `editMode` flag is true, a delete button is displayed for each post.
 * If no posts are available, a message indicating no posts have been added is shown.
 * 
 * Parameters:
 * - posts (Array): An array of post objects, where each object contains:
 *    - id (String): Unique identifier for the post
 *    - title (String): The title of the post
 *    - content (String): The content or body of the post
 * - editMode (Boolean): A flag indicating whether the component is in "edit mode".
 *   If true, delete buttons are shown for each post.
 * - onDeletePost (Function): A function to handle the deletion of a post.
 *   It is called when the delete button is clicked.
 * 
 * Description:
 * - This component maps through the posts array and renders each post inside a Card component.
 * - If `editMode` is enabled, a delete button is shown to allow the user to delete a post.
 * - If no posts are available, a "No posts yet" message is displayed.
 */

export const UserPostsSection = ({ posts, editMode, onDeletePost }) => {
  return (
    <div className="user-posts-section">
      <h3 className="section-title">Posts</h3>
      <div className="posts-container-profile-view">
        {posts.length === 0 ? (
          <p className="no-posts-message">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="post-card-profile-view">
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
