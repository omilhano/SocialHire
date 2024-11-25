import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import lookGlass from '../images/lookglass.png';
import '../styles/ChatPage.css';
import LastChat from '../components/LastChat';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const ChatPage = () => {
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);

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

    return (
        <Container fluid id="background" className="g-0">
            <div className="chat-page-body">
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
                <div className="chat-body">
                    <div className="chat-sidebar">
                        {searchResults.length > 0 ? (
                            searchResults.map((user) => (
                                <div key={user.id} className="user-item">
                                    <p>{user.firstName}</p>
                                </div>
                            ))
                        ) : (
                            <p>No users found</p>
                        )}
                    </div>
                    <LastChat />
                    <div className="chat-focus"></div>
                </div>
            </div>
        </Container>
    );
};

export default ChatPage;
