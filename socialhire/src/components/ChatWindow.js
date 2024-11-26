import React, { useEffect, useState } from 'react';
import { useFirebaseDocument } from '../hooks/useFirebase'; // Ensure correct imports

const ChatWindow = ({ currentUserId, selectedChat }) => {
    const [chat, setChat] = useState(null); // State for the current chat
    const [chatUserName, setChatUserName] = useState(''); // State for the other user's name
    const [messages, setMessages] = useState([]); // State for the chat messages
    const { getDocument, getDocumentsByUserId, addDocument } = useFirebaseDocument('chats'); // Firebase hooks

    useEffect(() => {
        const fetchOrCreateChat = async () => {
            if (!selectedChat || !currentUserId) {
                console.warn('Chat cannot be fetched or created because user ID or chat ID is missing.');
                setChat(null); // No chat available
                return;
            }

            const chatId = `${currentUserId}_${selectedChat}`;
            console.log(`Fetching chat for ${chatId}`);

            try {
                // Check if the chat exists
                const existingChat = await getDocument('chats', chatId);
                if (existingChat) {
                    console.log('Existing chat found:', existingChat);
                    setChat({ id: chatId, ...existingChat });
                } else if (!chat) { // Create only if a chat doesn't exist
                    console.log('No existing chat. Creating new one.');
                    const newChatData = {
                        participants: [currentUserId, selectedChat],
                        lastMessage: '',
                        lastMessageTimestamp: null,
                    };
                    const { success, id } = await addDocument('chats', chatId, newChatData);

                    if (success) {
                        console.log('New chat created with ID:', id);
                        setChat({ id, ...newChatData });
                    } else {
                        console.error('Failed to create chat.');
                    }
                }
            } catch (err) {
                console.error('Error fetching or creating chat:', err);
            }
        };

        fetchOrCreateChat();
    }, [selectedChat, currentUserId, getDocument, addDocument, chat]);

    useEffect(() => {
        const fetchUserName = async () => {
            if (!selectedChat) return;
            try {
                console.log(`Fetching name for user ID: ${selectedChat}`);
                const userData = await getDocument('users', selectedChat); // Check users collection
                console.log('Fetched user data:', userData);

                if (userData && userData.firstName && userData.lastName) {
                    // Combine firstName and lastName
                    const fullName = `${userData.firstName} ${userData.lastName}`;
                    setChatUserName(fullName);
                } else {
                    console.warn('User data incomplete. Using fallback name.');
                    setChatUserName('Unknown User');
                }
            } catch (err) {
                console.error('Error fetching user name:', err);
                setChatUserName('Unknown User');
            }
        };

        fetchUserName();
    }, [selectedChat, getDocument]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedChat || !currentUserId) return;
            const chatId = `${currentUserId}_${selectedChat}`;
            try {
                // Fetch messages for this chat from the 'chats/{chatId}/messages' subcollection
                const chatMessages = await getDocumentsByUserId('chats', chatId);
                setMessages(chatMessages || []); // Store the messages in the state
            } catch (err) {
                console.error('Error fetching chat messages:', err);
                setMessages([]);
            }
        };

        fetchMessages();
    }, [selectedChat, currentUserId, getDocumentsByUserId]);

    if (!selectedChat) {
        return <div className="no-chat-selected"><h2>Select a chat to view the conversation</h2></div>;
    }

    if (!chat) {
        return <p>Loading chat...</p>;
    }

    return (
        <div className="chat-main">
            <h2>Chat with {chatUserName}</h2>
            <div className="chat-box">
                {messages.length === 0 ? (
                    <p>No messages yet. A simple hello could lead to your next opportunity!</p>
                ) : (
                    messages.map((msg, index) => (
                        <p key={index}>{msg.text}</p> // Assuming each message has a 'text' property
                    ))
                )}
            </div>
        </div>
    );
};

export default ChatWindow;
