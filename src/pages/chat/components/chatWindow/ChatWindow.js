import React, { useState, useEffect, useRef } from 'react';
import { db } from 'firebaseConfig';
import { getDoc, doc, collection, addDoc, updateDoc, setDoc } from 'firebase/firestore';
import { useGetMessagesOrdered } from 'common/hooks/useGetMessagesOrdered';
import './ChatWindow.css';

const ChatWindow = ({ currentUserId, selectedChat }) => {
    const [chatUserName, setChatUserName] = useState('');
    const [messageText, setMessageText] = useState('');
    const chatBoxRef = useRef(null); // Ref for the chat-box

    const chatId = [currentUserId, selectedChat].sort().join('_');
    const { messages, loading, error } = useGetMessagesOrdered(chatId);
    // Log messages to debug
    useEffect(() => {
        console.log('Messages in ChatWindow:', messages);
    }, [messages]);

    useEffect(() => {
        const fetchUserName = async () => {
            if (!selectedChat) return;
            try {
                const userDoc = await getDoc(doc(db, 'users', selectedChat));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
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
        if (!messageText || !selectedChat || !currentUserId) {
            console.error("Missing message text, selected chat, or current user ID.");
            return;
        }

        const newMessage = {
            senderId: currentUserId,
            text: messageText,
            timestamp: new Date(),
        };

        try {
            const chatRef = doc(db, 'chats', chatId);
            const chatDoc = await getDoc(chatRef);

            if (!chatDoc.exists()) {
                await setDoc(chatRef, {
                    lastMessage: newMessage.text,
                    lastMessageTimestamp: newMessage.timestamp,
                });
            } else {
                await updateDoc(chatRef, {
                    lastMessage: newMessage.text,
                    lastMessageTimestamp: newMessage.timestamp,
                });
            }

            const messagesRef = collection(chatRef, 'messages');
            await addDoc(messagesRef, newMessage);
            setMessageText('');
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    // Scroll to the bottom of the chat-box whenever messages change
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    if (loading) {
        return <p>Loading messages...</p>;
    }

    if (error) {
        return <p>Error loading messages: {error.message}</p>;
    }

    if (!selectedChat) {
        return <div className="no-chat-selected"><h2>Select a chat to view the conversation</h2></div>;
    }

    return (
        <div className="chat-main">
            <h2>Chat with {chatUserName}</h2>

            <div className="chat-box" ref={chatBoxRef}>
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
                <button id="send-message-button" onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatWindow;
