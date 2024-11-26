import React from 'react';

const ChatWindow = ({ chats, selectedChat }) => {
    const chat = chats.find(c => c.id === selectedChat);

    return (
        <div className="chat-main">
            {chat ? (
                <div>
                    <h2>Chat with {chat.name}</h2>
                    <div className="chat-box">
                        <p>Chat messages will appear here for {chat.name}.</p>
                    </div>
                </div>
            ) : (
                <div className="no-chat-selected">
                    <h2>Select a chat to view the conversation</h2>
                </div>
            )}
        </div>
    );
};

export default ChatWindow;
