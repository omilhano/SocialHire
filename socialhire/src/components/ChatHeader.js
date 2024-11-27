import React, { useEffect, useState } from 'react';
import { InputGroup, Form } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

const ChatHeader = ({ searchQuery, setSearchQuery }) => {
    const { user } = useAuth(); // Assume `user` contains the current logged-in user's data
    const [friends, setFriends] = useState([]);
    const [filteredFriends, setFilteredFriends] = useState([]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const connectionsRef = collection(db, 'connections');
                const q = query(
                    connectionsRef,
                    where('status', '==', 'friends'),
                    where('userId', '==', user.uid) // Assuming `userId` is the field in the connections collection
                );
                const querySnapshot = await getDocs(q);
                const friendsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setFriends(friendsList);
                setFilteredFriends(friendsList); // Initially show all friends
                console.log("Success!")
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };

        fetchFriends();
    }, [user.uid]);

    // Filter friends based on search query
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredFriends(friends);
        } else {
            const searchResults = friends.filter(friend =>
                friend.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredFriends(searchResults);
        }
    }, [searchQuery, friends]);

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
            <ul className="friends-list">
                {filteredFriends.map(friend => (
                    <li key={friend.id}>{friend.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default ChatHeader;
