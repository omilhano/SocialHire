import React, { useEffect, useState } from 'react';
import { Modal, Spinner, Button } from 'react-bootstrap';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Import Firebase configuration
import { useAuth } from '../hooks/useAuth'; // Import the authentication hook

const RecommendModal = ({ show, onClose, jobId }) => {
    const { user } = useAuth(); // Get the authenticated user
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFriend, setSelectedFriend] = useState(null);

    useEffect(() => {
        if (!show || !user) return;

        const fetchFriends = async () => {
            setLoading(true);
            try {
                const connectionsCollectionRef = collection(db, 'Connections');

                const connectionsQuery1 = query(
                    connectionsCollectionRef,
                    where('user_id', '==', user.uid), // Use user.uid
                    where('status', '==', 'friends')
                );

                const connectionsQuery2 = query(
                    connectionsCollectionRef,
                    where('connected_user_id', '==', user.uid), // Use user.uid
                    where('status', '==', 'friends')
                );

                const [connectionsSnapshot1, connectionsSnapshot2] = await Promise.all([
                    getDocs(connectionsQuery1),
                    getDocs(connectionsQuery2),
                ]);

                const connectedUserIds = new Set([
                    ...connectionsSnapshot1.docs.map(doc => doc.data().connected_user_id),
                    ...connectionsSnapshot2.docs.map(doc => doc.data().user_id),
                ]);

                const friendsList = await Promise.all(
                    Array.from(connectedUserIds).map(async userId => {
                        const userDocRef = collection(db, 'users');
                        const userDocSnapshot = await getDocs(query(userDocRef, where('userId', '==', userId)));

                        if (!userDocSnapshot.empty) {
                            const userData = userDocSnapshot.docs[0].data();
                            return {
                                id: userId,
                                name: `${userData.firstName} ${userData.lastName}`,
                            };
                        }
                        return null;
                    })
                );

                setFriends(friendsList.filter(friend => friend !== null));
            } catch (error) {
                console.error('Error fetching friends:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFriends();
    }, [show, user]);

    const handleRecommend = () => {
        if (selectedFriend) {
            // Handle the recommendation logic here
            console.log(`Recommended job ${jobId} to ${selectedFriend.name}`);
            onClose(); // Close the modal after recommendation
        }
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Recommend Job</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="loading-container">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : (
                    <div className="friends-list">
                        {friends.length > 0 ? (
                            friends.map(friend => (
                                <div
                                    key={friend.id}
                                    className={`friend-item ${selectedFriend?.id === friend.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedFriend(friend)}
                                >
                                    <span>{friend.name}</span>
                                </div>
                            ))
                        ) : (
                            <p>No friends available to recommend.</p>
                        )}
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleRecommend}
                    disabled={!selectedFriend}
                >
                    Recommend
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RecommendModal;
