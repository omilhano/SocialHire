import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Container, Spinner, Alert, Card, Button } from "react-bootstrap";
import "../styles/ProfilePage.css";

const ProfilePage = () => {
    const { username } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [friendStatus, setFriendStatus] = useState("none"); // "none", "pending", "friends"
    const [connectionId, setConnectionId] = useState(null); // ID of the connection for "Remove Friend"

    const auth = getAuth();
    const currentUserId = auth.currentUser?.uid;

    useEffect(() => {
        const fetchProfileAndConnection = async () => {
            try {
                // Fetch profile data
                const userQuery = query(
                    collection(db, "users"),
                    where("username", "==", username)
                );
                const userSnapshot = await getDocs(userQuery);

                if (userSnapshot.empty) {
                    throw new Error("User not found");
                }

                const profile = userSnapshot.docs[0].data();
                setProfileData(profile);

                // Check friendship status
                await checkFriendshipStatus(profile.userId);
            } catch (err) {
                console.error("Error fetching profile or connection:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const checkFriendshipStatus = async (profileUserId) => {
            try {
                const connectionsRef = collection(db, "Connections");

                // Query for existing connections between the current user and the profile user
                const connectionQuery = query(
                    connectionsRef,
                    where("user_id", "in", [currentUserId, profileUserId]),
                    where("connected_user_id", "in", [currentUserId, profileUserId])
                );

                const connectionSnapshot = await getDocs(connectionQuery);

                if (!connectionSnapshot.empty) {
                    const connectionData = connectionSnapshot.docs[0].data();
                    setConnectionId(connectionSnapshot.docs[0].id);

                    if (connectionData.status === "friends") {
                        setFriendStatus("friends");
                    } else if (connectionData.status === "pending") {
                        setFriendStatus("pending");
                    }
                } else {
                    setFriendStatus("none");
                }
            } catch (err) {
                console.error("Error checking friendship status:", err);
            }
        };

        fetchProfileAndConnection();
    }, [username, currentUserId]);

    const handleAddFriend = async () => {
        try {
            const connectionsRef = collection(db, "Connections");

            await addDoc(connectionsRef, {
                user_id: currentUserId,
                connected_user_id: profileData.userId,
                status: "pending",
                created_at: new Date(),
            });

            setFriendStatus("pending");
        } catch (err) {
            console.error("Error sending friend request:", err);
        }
    };

    const handleRemoveFriend = async () => {
        try {
            if (connectionId) {
                await deleteDoc(doc(db, "Connections", connectionId));
                setFriendStatus("none");
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
                {/* Friend Button */}
                {friendStatus === "none" && (
                    <Button className="add-friend-button mt-3" onClick={handleAddFriend}>
                        Add Friend
                    </Button>
                )}
                {friendStatus === "pending" && (
                    <Button className="add-friend-button mt-3" disabled>
                        Request Pending
                    </Button>
                )}
                {friendStatus === "friends" && (
                    <Button className="remove-friend-button mt-3" onClick={handleRemoveFriend}>
                        Remove Friend
                    </Button>
                )}
            </Card>
        </Container>
    );
};

export default ProfilePage;
