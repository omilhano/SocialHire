import React, { useEffect, useState } from 'react';
import { InputGroup, Form } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

const ChatHeader = ({ searchQuery, setSearchQuery, setFilteredFriends }) => {
    const { user } = useAuth(); // Assume `user` contains the current logged-in user's data
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const connectionsRef = collection(db, 'Connections');

                // Query for connections where the user is 'user_id' or 'connected_user_id'
                const q1 = query(
                    connectionsRef,
                    where('user_id', '==', user.uid),
                    where('status', '==', 'friends')
                );
                const q2 = query(
                    connectionsRef,
                    where('connected_user_id', '==', user.uid),
                    where('status', '==', 'friends')
                );

                const [querySnapshot1, querySnapshot2] = await Promise.all([getDocs(q1), getDocs(q2)]);
                const friendDetailsPromises = [];

                querySnapshot1.docs.forEach(doc => {
                    const data = doc.data();
                    const friendId = data.connected_user_id;
                    friendDetailsPromises.push(fetchFriendDetails(friendId));
                });

                querySnapshot2.docs.forEach(doc => {
                    const data = doc.data();
                    const friendId = data.user_id;
                    friendDetailsPromises.push(fetchFriendDetails(friendId));
                });

                const friendsList = await Promise.all(friendDetailsPromises);
                setFriends(friendsList);
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };

        fetchFriends();
    }, [user.uid]);

    const fetchFriendDetails = async (friendId) => {
        const userDocRef = doc(db, 'users', friendId);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.exists() ? userDoc.data() : {};
        return {
            id: friendId,
            ...userData,
            name: `${userData.firstName} ${userData.lastName}`,
        };
    };

    // Filter friends based on search query
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredFriends([]); // Reset filtered friends when search is empty
        } else {
            const searchResults = friends.filter(friend =>
                friend.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredFriends(searchResults); // Update filtered friends
        }
    }, [searchQuery, friends, setFilteredFriends]);

    return (
        <div className="chat-header">
            <h1>Chatting</h1>
            <InputGroup className="search-bar">
                <Form.Control
                    type="text"
                    placeholder="Search chats..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)} // Set the search query as user types
                />
            </InputGroup>
        </div>
    );
};

export default ChatHeader;
