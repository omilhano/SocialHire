import React, { useEffect, useState } from 'react';
import { Modal, Spinner, Button } from 'react-bootstrap';
import { collection, query, where, getDocs, doc, setDoc, addDoc, Timestamp } from 'firebase/firestore';
import { db } from 'firebaseConfig';
import { useAuth } from 'common/hooks/useAuth';


const RecommendModal = ({ show, onClose, jobId, jobTitle }) => {
    const { user } = useAuth();
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [sending, setSending] = useState(false);

    // Fetch friends of the user
    useEffect(() => {
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
                    Array.from(connectedUserIds).map(async friendId => {
                        const userDocSnapshot = await getDocs(
                            query(collection(db, 'users'), where('userId', '==', friendId))
                        );

                        if (!userDocSnapshot.empty) {
                            const friendData = userDocSnapshot.docs[0].data();
                            return {
                                id: friendId,
                                name: `${friendData.firstName} ${friendData.lastName}`,
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
    }, [user]);

    // Handle recommend action
    const handleRecommend = async () => {
        if (!selectedFriend) return;

        setSending(true);

        try {
            const friendId = selectedFriend.id;

            // Check if a chat already exists between the user and the friend
            const chatsCollection = collection(db, 'chats');
            const chatQuery = query(
                chatsCollection,
                where('users', 'array-contains', user.uid)
            );

            const chatSnapshot = await getDocs(chatQuery);

            let chatId = null;

            // Find the specific chat for this user and friend
            chatSnapshot.forEach(doc => {
                const chatData = doc.data();
                if (chatData.users.includes(friendId)) {
                    chatId = doc.id;
                }
            });

            // If no chat exists, create a new chat
            if (!chatId) {
                chatId = [user.uid, friendId].sort().join('_');
                const newChatRef = await addDoc(chatsCollection, {
                    users: [user.uid, friendId],
                    lastMessage: '',
                    lastMessageTimestamp: Timestamp.now(),
                });
            }
            // Create a clickable link to the job page
            // CHANGE THIS BEFORE DEPLOYING
            const jobLink = `http://localhost:3000/job/${jobId}`; // Assuming your job details route is like /job/:jobId
            const messageText = `I recommend you check out this job: "${jobTitle}". Click here to view the details: ${jobLink}`;

            // Add the recommendation as a new message in the chat's messages subcollection
            const messagesCollection = collection(db, 'chats', chatId, 'messages');
            await addDoc(messagesCollection, {
                senderId: user.uid,
                text: messageText,
                timestamp: Timestamp.now(),
            });

            // Update the last message and timestamp in the parent chat document
            const chatDocRef = doc(db, 'chats', chatId);
            await setDoc(chatDocRef, {
                lastMessage: `I recommend you check out this job: "${jobTitle}".`,
                lastMessageTimestamp: Timestamp.now(),
            }, { merge: true });

            alert('Recommendation sent successfully!');
            onClose();
        } catch (error) {
            console.error('Error sending recommendation:', error);
            alert('Failed to send recommendation.');
        } finally {
            setSending(false);
        }
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Recommend Job</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <Spinner animation="border" />
                ) : (
                    <div>
                        {friends.length > 0 ? (
                            friends.map(friend => (
                                <div
                                    key={friend.id}
                                    className={`friend-item ${selectedFriend?.id === friend.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedFriend(friend)}
                                    style={{
                                        padding: '10px',
                                        cursor: 'pointer',
                                        background: selectedFriend?.id === friend.id ? '#e0e0e0' : 'transparent',
                                        borderRadius: '5px',
                                    }}
                                >
                                    {friend.name}
                                </div>
                            ))
                        ) : (
                            <p>No friends found.</p>
                        )}
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
                <Button
                    variant="primary"
                    onClick={handleRecommend}
                    disabled={!selectedFriend || sending}
                >
                    {sending ? 'Sending...' : 'Recommend'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RecommendModal;
