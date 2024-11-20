import React from 'react';
import { PenSquare } from 'lucide-react';
import { PostList } from '../PostCard'; // Adjust the import path based on your file structure
import CreatePostPopup from '../CreatePostPopup'; // Adjust the import path based on your file structure

export const PostsSection = ({
    posts,
    loading,
    showAllPosts,
    isCreatePostOpen,
    onShowAllPostsChange,
    onCreatePostOpenChange,
    onPostCreated
}) => (
    <div className="profile-section posts-section">
        <div className="section-header">
            <h2>My Posts</h2>
            <button
                onClick={() => onCreatePostOpenChange(true)}
                className="create-post-btn"
            >
                <PenSquare size={16} />
                Create Post
            </button>
        </div>

        <PostList posts={posts} loading={loading} />

        {!showAllPosts && posts.length >= 4 && (
            <div className="text-center mt-4">
                <button
                    onClick={() => onShowAllPostsChange(true)}
                    className="see-all-btn"
                >
                    See All Posts
                </button>
            </div>
        )}

        <CreatePostPopup
            isOpen={isCreatePostOpen}
            onClose={() => onCreatePostOpenChange(false)}
            onPostCreated={() => {
                onPostCreated();
                onCreatePostOpenChange(false);
            }}
        />
    </div>
);