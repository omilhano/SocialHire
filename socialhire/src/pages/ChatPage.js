import React, { useState } from 'react'; // React library
import { Container, Form, InputGroup, Card } from 'react-bootstrap'; // Bootstrap components for layout and styling
import '../styles/ChatPage.css'; // Custom CSS for the Chat page

const ChatPage = () => {
    const [selectedChat, setSelectedChat] = useState(null); // State to track the currently selected chat
    const [searchQuery, setSearchQuery] = useState(''); // State to track search input

    // Mock data for past chats
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
                {/* Header Section */}
                <div className="chat-header">
                    <h1>Chatting</h1>
                    <InputGroup className="search-bar">
                        <Form.Control
                            type="text"
                            placeholder="Search chats..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </InputGroup>
                </div>

                {/* Sidebar - Past Chats */}
                <div className="chat-sidebar">
                    <h2>Past Chats</h2>
                    <div className="chat-list">
                        {filteredChats.map(chat => (
                            <Card
                                key={chat.id}
                                className={`chat-card ${selectedChat === chat.id ? 'active' : ''}`}
                                onClick={() => setSelectedChat(chat.id)}
                            >
                                <Card.Body>
                                    <Card.Title>{chat.name}</Card.Title>
                                    <Card.Text>{chat.lastMessage}</Card.Text>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Main Chat Section */}
                <div className="chat-main">
                    {selectedChat ? (
                        <div>
                            <h2>Chat with {chats.find(chat => chat.id === selectedChat)?.name}</h2>
                            <div className="chat-box">
                                {/* Placeholder for chat messages */}
                                <p>Chat messages will appear here.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="no-chat-selected">
                            <h2>Select a chat to view the conversation</h2>
                        </div>
                    )}
                </div>
            </div>
        </Container>
    );
};

export default ChatPage;
