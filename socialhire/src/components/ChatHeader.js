import React from 'react';
import { InputGroup, Form } from 'react-bootstrap';

const ChatHeader = ({ searchQuery, setSearchQuery }) => {
    return (
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
    );
};

export default ChatHeader;
