import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Container, Spinner, Alert, Card, Button } from "react-bootstrap";
import '../styles/ProfilePage.css';

const ProfilePage = () => {
    const { username } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [friendshipStatus, setFriendshipStatus] = useState(null); // "friends", "pending", or null
    const [currentUserId, setCurrentUserId] = useState(null); // Current logged-in user's ID

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const auth = getAuth();
                const loggedInUserId = auth.currentUser?.uid;
                setCurrentUserId(loggedInUserId); // Store current user's ID

                const userQuery = query(
                    collection(db, "users"),
                    where("username", "==", username)
                );
                const querySnapshot = await getDocs(userQuery);

                if (!querySnapshot.empty) {
                    const profile = querySnapshot.docs[0].data();
                    setProfileData(profile);
                    checkFriendshipStatus(loggedInUserId, profile.userId); // Check friendship status
                } else {
                    throw new Error("User not found");
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const checkFriendshipStatus = async (loggedInUserId, profileUserId) => {
            try {
                if (loggedInUserId === profileUserId) {
                    return; // No need to check friendship status for yourself
                }

                const connectionsQuery = query(
                    collection(db, "Connections"),
                    where("user_id", "in", [loggedInUserId, profileUserId]),
                    where("connected_user_id", "in", [loggedInUserId, profileUserId])
                );

                const snapshot = await getDocs(connectionsQuery);
                if (!snapshot.empty) {
                    const connection = snapshot.docs[0].data();
                    setFriendshipStatus(connection.status); // "friends" or "pending"
                }
            } catch (err) {
                console.error("Error checking friendship status:", err);
            }
        };

        fetchProfile();
    }, [username]);

    const handleAddFriend = async () => {
        try {
            const connectionsCollectionRef = collection(db, "Connections");
            const newConnection = {
                user_id: currentUserId,
                connected_user_id: profileData.userId,
                status: "pending",
                created_at: new Date()
            };

            await addDoc(connectionsCollectionRef, newConnection);
            setFriendshipStatus("pending");
        } catch (err) {
            console.error("Error sending friend request:", err);
        }
    };

    const handleRemoveFriend = async () => {
        try {
            const connectionsQuery = query(
                collection(db, "Connections"),
                where("user_id", "in", [currentUserId, profileData.userId]),
                where("connected_user_id", "in", [currentUserId, profileData.userId])
            );

            const snapshot = await getDocs(connectionsQuery);
            if (!snapshot.empty) {
                const docId = snapshot.docs[0].id;
                await deleteDoc(doc(db, "Connections", docId));
                setFriendshipStatus(null); // Reset friendship status
            }
        } catch (err) {
            console.error("Error removing friend:", err);
        }
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="d-flex justify-content-center align-items-center vh-100">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    if (!profileData) {
        return (
            <Container className="d-flex justify-content-center align-items-center vh-100">
                <Alert variant="warning">Profile not found</Alert>
            </Container>
        );
    }

    const isCurrentUserProfile = currentUserId === profileData.userId;

    return (
        <Container className="profile-container d-flex flex-column justify-content-center align-items-center vh-100">
            {/* Profile Picture */}
            <div className="profile-image-wrapper">
                <img
                    src={`https://ui-avatars.com/api/?name=${profileData.firstName}+${profileData.lastName}&background=177b7b&color=ffffff`} 
                    alt={`${profileData.firstName} ${profileData.lastName}`}
                    className="profile-image"
                />
            </div>
            
            {/* User Card */}
            <Card className="profile-card mt-3 shadow-sm">
                <Card.Body>
                    <Card.Title className="text-center profile-card-title">
                        {profileData.firstName} {profileData.lastName}
                    </Card.Title>
                    <Card.Subtitle className="text-muted text-center profile-card-subtitle">
                        {profileData.location}
                    </Card.Subtitle>
                    <Card.Text className="mt-3 text-center profile-card-text">
                        {profileData.about}
                    </Card.Text>
                </Card.Body>
                {/* Add Friend Button */}
                {!isCurrentUserProfile && (
                    <Button 
                        className="follow-button mt-3"
                        onClick={() => {
                            if (friendshipStatus === "friends") {
                                handleRemoveFriend();
                            } else if (friendshipStatus === null) {
                                handleAddFriend();
                            }
                        }}
                        disabled={friendshipStatus === "pending"}
                    >
                        {friendshipStatus === "friends" && "Remove Friend"}
                        {friendshipStatus === "pending" && "Request Pending"}
                        {friendshipStatus === null && "Add Friend"}
                    </Button>
                )}
            </Card>
        </Container>
    );
};

export default ProfilePage;
