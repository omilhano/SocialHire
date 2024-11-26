import React from 'react';
import { Card } from 'react-bootstrap';

const ChatList = ({ chats, selectedChat, setSelectedChat }) => {
    return (
        <div className="chat-sidebar">
            <h2>Past Chats</h2>
            <div className="chat-list">
                {chats.map(chat => (
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
    );
};

export default ChatList;
