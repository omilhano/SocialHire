import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import '../styles/ChatPage.css';
import ChatHeader from '../components/ChatHeader';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';

const ChatPage = () => {
    const [selectedChat, setSelectedChat] = useState(null); // Tracks the currently selected chat
    const [searchQuery, setSearchQuery] = useState(''); // Tracks search input

    // Mock data for chats
    const chats = [
        { id: 1, name: 'John Doe', lastMessage: 'Hey, how are you?' },
        { id: 2, name: 'Jane Smith', lastMessage: 'Meeting at 3 PM' },
        { id: 3, name: 'Michael Brown', lastMessage: 'Let’s catch up later!' },
        { id: 4, name: 'Emily White', lastMessage: 'Thanks for the update.' },
    ];

    // Filter chats based on search query
    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Container fluid id="chat-background" className="g-0">
            <div className="chat-grid-layout">
                {/* Header */}
                <ChatHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

                {/* Sidebar - Chat List */}
                <ChatList
                    chats={filteredChats}
                    selectedChat={selectedChat}
                    setSelectedChat={setSelectedChat}
                />

                {/* Main - Chat Window */}
                <ChatWindow chats={chats} selectedChat={selectedChat} />
            </div>
        </Container>
    );
};

export default ChatPage;
