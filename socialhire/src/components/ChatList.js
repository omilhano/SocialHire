import React, { useEffect, useState } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Import your Firebase configuration

const ChatList = ({ currentUserId, selectedChat, setSelectedChat }) => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch friends list from Firestore
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const connectionsCollectionRef = collection(db, 'Connections');
        
                // Query for cases where currentUserId added someone
                const connectionsQuery1 = query(
                    connectionsCollectionRef,
                    where('user_id', '==', currentUserId),
                    where('status', '==', 'friends')
                );
        
                // Query for cases where currentUserId was added by someone
                const connectionsQuery2 = query(
                    connectionsCollectionRef,
                    where('connected_user_id', '==', currentUserId),
                    where('status', '==', 'friends')
                );
        
                // Execute both queries
                const [connectionsSnapshot1, connectionsSnapshot2] = await Promise.all([
                    getDocs(connectionsQuery1),
                    getDocs(connectionsQuery2),
                ]);
        
                // Extract connected user IDs
                const connectedUserIds = new Set([
                    ...connectionsSnapshot1.docs.map(doc => doc.data().connected_user_id),
                    ...connectionsSnapshot2.docs.map(doc => doc.data().user_id),
                ]);
        
                // Fetch user details for each connected friend
                const friendsList = await Promise.all(
                    Array.from(connectedUserIds).map(async userId => {
                        // Fetch the user's data from the 'users' collection
                        const userDocRef = collection(db, 'users');
                        const userDocSnapshot = await getDocs(query(userDocRef, where('userId', '==', userId)));
        
                        if (!userDocSnapshot.empty) {
                            const userData = userDocSnapshot.docs[0].data();
                            return {
                                id: userId,
                                name: `${userData.firstName} ${userData.lastName}`, // Use the real name
                                lastMessage: 'Last message placeholder', // Replace with the actual last message if needed
                            };
                        }
                        return null; // If no user found, return null
                    })
                );
        
                // Filter out null values if there were any missing users
                setFriends(friendsList.filter(friend => friend !== null));
            } catch (error) {
                console.error('Error fetching friends:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFriends();
    }, [currentUserId]);

    if (loading) {
        return (
            <div className="loading-container">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <div className="chat-sidebar">
            <h2>Friends</h2>
            <div className="chat-list">
                {friends.map(friend => (
                    <Card
                        key={friend.id}
                        className={`chat-card ${selectedChat === friend.id ? 'active' : ''}`}
                        onClick={() => setSelectedChat(friend.id)}
                    >
                        <Card.Body>
                            <Card.Title>{friend.name}</Card.Title>
                            <Card.Text>{friend.lastMessage}</Card.Text>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ChatList;
