import React, { useEffect, useState } from 'react';
import { Modal, Spinner, Button } from 'react-bootstrap';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../hooks/useAuth';

const RecommendModal = ({ show, onClose, jobId }) => {
    const { user } = useAuth();
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);

    useEffect(() => {
        if (!show || !user) return;

        const fetchFriends = async () => {
            setLoading(true);
            try {
                const connectionsCollectionRef = collection(db, 'Connections');

                const connectionsQuery1 = query(
                    connectionsCollectionRef,
                    where('user_id', '==', user.uid),
                    where('status', '==', 'friends')
                );

                const connectionsQuery2 = query(
                    connectionsCollectionRef,
                    where('connected_user_id', '==', user.uid),
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
                ) : friends.length > 0 ? (
                    <div className="friends-list">
                        {friends.map(friend => (
                            <div
                                key={friend.id}
                                className={`friend-item ${selectedFriend?.id === friend.id ? 'selected' : ''}`}
                                onClick={() => setSelectedFriend(friend)}
                                style={{
                                    cursor: 'pointer', // Ensure the item is clickable
                                    padding: '10px',
                                    margin: '5px 0',
                                    border: selectedFriend?.id === friend.id ? '2px solid #007bff' : '1px solid #ccc',
                                    borderRadius: '5px',
                                    backgroundColor: selectedFriend?.id === friend.id ? '#e9f5ff' : '#fff',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <span>{friend.name}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No friends available to recommend.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={() => {
                        if (selectedFriend) {
                            console.log(`Recommended job ${jobId} to ${selectedFriend.name}`);
                            onClose();
                        }
                    }}
                    disabled={!selectedFriend}
                >
                    Recommend
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RecommendModal;
