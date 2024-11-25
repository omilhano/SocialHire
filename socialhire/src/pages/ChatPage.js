// Import necessary dependencies and styles
import React, { useState, useEffect } from 'react';
import { Container, Form } from 'react-bootstrap';
import lookGlass from '../images/lookglass.png';
import '../styles/ChatPage.css';
import LastChat from '../components/LastChat';
import { collection, doc, getDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebaseConfig'; 

const ChatPage = () => {
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [currentChat, setCurrentChat] = useState(null); // For storing the currently focused chat
    const [currentChatName, setCurrentChatName] = useState(''); // Store the name of the other user
    const [messages, setMessages] = useState([]); // Store messages for the current chat

    // Fetch search results from Firestore
    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        const sanitizedInput = searchInput.trim();

        if (!sanitizedInput) {
            console.error('Input cannot be empty');
            return;
        }

        try {
            const usersCollection = collection(db, 'users');
            const startText = sanitizedInput;
            const endText = sanitizedInput + '\uf8ff';

            const q = query(usersCollection, where('firstName', '>=', startText), where('firstName', '<', endText));
            const querySnapshot = await getDocs(q);

            const users = [];
            querySnapshot.forEach((doc) => {
                users.push({ id: doc.id, ...doc.data() });
            });

            setSearchResults(users);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // Fetch messages for the selected chat and update the chat participant's name
    const fetchMessages = async (chatId) => {
        try {
            // Fetch messages
            const messagesCollection = collection(db, `chats/${chatId}/messages`);
            const q = query(messagesCollection, orderBy('timestamp', 'asc'), limit(50)); // Get the latest 50 messages
            const querySnapshot = await getDocs(q);

            const fetchedMessages = [];
            querySnapshot.forEach((doc) => {
                fetchedMessages.push({ id: doc.id, ...doc.data() });
            });

            setMessages(fetchedMessages);

            // Fetch the other participant's name
            const chatDocRef = doc(db, 'chats', chatId);
            const chatDoc = await getDoc(chatDocRef);

            if (chatDoc.exists()) {
                const { participants } = chatDoc.data();

                // Assume the logged-in user is "me"; find the other user
                const otherUserId = participants.find((id) => id !== 'me'); // Replace 'me' with the current user's ID if available

                if (otherUserId) {
                    const userDocRef = doc(db, 'users', otherUserId);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const { firstName, lastName } = userDoc.data();
                        setCurrentChatName(`${firstName} ${lastName}`);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching messages or user info:', error);
        }
    };

    // Handle selecting a chat
    const handleSelectChat = (chatId) => {
        setCurrentChat(chatId);
        fetchMessages(chatId);
    };

    return (
        <Container fluid id="background-chat" className="g-0">
            <div className="chat-page-body">
                {/* Header with search bar */}
                <div className="chat-header">
                    <p id="header-text">Messaging</p>
                    <Form className="search-bar" onSubmit={handleSearchSubmit}>
                        <Form.Control
                            type="text"
                            placeholder="Search"
                            className="searchbar-header"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <button type="submit" className="search-button">
                            <img src={lookGlass} alt="Search" className="search-icon" />
                        </button>
                    </Form>
                </div>

                {/* Main body layout */}
                <div className="chat-body">
                    {/* Sidebar: Display search results */}
                    <div className="chat-sidebar">
                        {searchResults.length > 0 ? (
                            searchResults.map((user) => (
                                <div
                                    key={user.id}
                                    className="user-item"
                                    onClick={() => handleSelectChat(user.id)} // Select chat when user is clicked
                                >
                                    <p>{user.firstName} {user.lastName}</p>
                                </div>
                            ))
                        ) : (
                            <p>No users found</p>
                        )}
                    </div>

                    {/* Display recent chats */}
                    <div className="recent-chats">
                        <LastChat onSelectChat={handleSelectChat} />
                    </div>

                    {/* Focused Chat View */}
                    <div className="chat-focus">
                        {currentChat ? (
                            <div>
                                {/* Updated Header for Focused Chat */}
                                <h4>{currentChatName ? `Chatting with ${currentChatName}` : 'Loading...'}</h4>
                                <div className="messages">
                                    {messages.map((msg) => (
                                        <div key={msg.id} className={`message ${msg.sender === 'me' ? 'sent' : 'received'}`}>
                                            <p>{msg.text}</p>
                                            <small>{new Date(msg.timestamp?.toDate()).toLocaleTimeString()}</small>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p>Select a chat to start messaging</p>
                        )}
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default ChatPage;
