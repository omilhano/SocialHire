import React, { useState } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import '../styles/ChatPage.css';
import ChatHeader from '../components/ChatHeader';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import { useAuth } from '../hooks/useAuth'; // Import the custom useAuth hook

const ChatPage = () => {
    const { user, loading } = useAuth(); // Get the authenticated user
    const [selectedChat, setSelectedChat] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Show a loading spinner while the authentication state is loading
    if (loading) {
        return (
            <div className="loading-container">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    // Extract the user ID from the authenticated user
    const currentUserId = user?.uid;

    return (
        <Container fluid id="chat-background" className="g-0">
            <div className="chat-grid-layout">
                {/* Header */}
                <ChatHeader
                    searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                />

                {/* Sidebar - Chat List */}
                <ChatList
                    currentUserId={currentUserId} // Pass the authenticated user ID
                    selectedChat={selectedChat}
                    setSelectedChat={setSelectedChat}
                />

                {/* Main - Chat Window */}
                <ChatWindow selectedChat={selectedChat} currentUserId={currentUserId} />
            </div>
        </Container>
    );
};

export default ChatPage;
