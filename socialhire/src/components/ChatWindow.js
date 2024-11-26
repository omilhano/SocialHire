import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';  // Import db from firebaseConfig
import {getDoc, doc, collection, addDoc, updateDoc } from 'firebase/firestore';  // Import Firestore functions
import { useGetMessagesOrdered } from '../hooks/useGetMessagesOrdered';  // Import the new hook
import './ChatWindow.css';  // Assuming the CSS file is in the same folder

const ChatWindow = ({ currentUserId, selectedChat }) => {
    const [chatUserName, setChatUserName] = useState('');  // State for the other user's name
    const [messageText, setMessageText] = useState('');  // State for the input text

    // Get messages using the new hook
    const { messages, loading, error } = useGetMessagesOrdered(`${currentUserId}_${selectedChat}`);

    useEffect(() => {
        const fetchUserName = async () => {
            if (!selectedChat) return;
            try {
                // Fetch user data (assuming you have a `users` collection)
                const userData = await getDoc(doc(db, 'users', selectedChat));  // Fetch user document by user ID
                if (userData && userData.firstName && userData.lastName) {
                    const fullName = `${userData.firstName} ${userData.lastName}`;
                    setChatUserName(fullName);
                } else {
                    setChatUserName('Unknown User');
                }
            } catch (err) {
                console.error('Error fetching user name:', err);
                setChatUserName('Unknown User');
            }
        };

        fetchUserName();
    }, [selectedChat]);

    const handleSendMessage = async () => {
        if (!messageText || !selectedChat || !currentUserId) return;
        
        const newMessage = {
            senderId: currentUserId,
            text: messageText,
            timestamp: new Date(),
        };

        const chatId = `${currentUserId}_${selectedChat}`;
        try {
            const chatRef = doc(db, 'chats', chatId);
            const messagesRef = collection(chatRef, 'messages');
            await addDoc(messagesRef, newMessage);  // Add the new message to Firestore
            
            // Update the lastMessage and lastMessageTimestamp in the main chat document
            await updateDoc(chatRef, {
                lastMessage: newMessage.text,
                lastMessageTimestamp: newMessage.timestamp,
            });

            setMessageText('');  // Clear the input field after sending the message
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    if (loading) {
        return <p>Loading messages...</p>;  // Show loading message while fetching
    }

    if (error) {
        return <p>Error loading messages: {error.message}</p>;  // Show error message if any
    }

    if (!selectedChat) {
        return <div className="no-chat-selected"><h2>Select a chat to view the conversation</h2></div>;
    }

    return (
        <div className="chat-main">
            <h2>Chat with {chatUserName}</h2>

            <div className="chat-box">
                {messages.length === 0 ? (
                    <p>No messages yet. A simple hello could lead to your next opportunity!</p>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.senderId === currentUserId ? 'sent' : 'received'}`}>
                            <p>{msg.senderId === currentUserId ? 'You' : chatUserName}:</p>
                            <p>{msg.text}</p>
                        </div>
                    ))
                )}
            </div>

            <div className="chat-input-box">
                <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatWindow;
