import React, { useEffect, useState } from "react"; // Import necessary React hooks
import { useParams } from "react-router-dom"; // Import to access URL parameters
import { db } from "../firebaseConfig"; // Import Firestore configuration
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore"; // Firestore functions to interact with data
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase authentication
import { Container, Spinner, Alert, Card, Button, Modal } from "react-bootstrap"; // UI components from react-bootstrap
import "../styles/ProfilePage.css"; // Import custom styling

const ProfilePage = () => {
    // Extract the 'username' from the URL parameters
    const { username } = useParams();

    // State variables for storing profile data, loading state, error messages, etc.
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [friendshipStatus, setFriendshipStatus] = useState(null); // Friendship status (friends, pending, etc.)
    const [blockStatus, setBlockStatus] = useState(null); // Block status (blocked or not)
    const [experienceData, setExperienceData] = useState([]); // User's experience data
    const [jobPosts, setJobPosts] = useState([]); // User's job posts
    const [socialPosts, setSocialPosts] = useState([]); // User's social posts
    const [showRemoveFriendModal, setShowRemoveFriendModal] = useState(false); // Modal state for removing friends
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        console.log("Auth state changed. Current user:", user);
    });
    const loggedInUserId = auth.currentUser?.uid; // Get the logged-in user's ID

    useEffect(() => {
        // Function to fetch profile data from Firestore based on the 'username'
        const fetchProfile = async () => {

            try {


                // Query to get the user document matching the provided username
                const userQuery = query(collection(db, "users"), where("username", "==", username));
                const querySnapshot = await getDocs(userQuery);

                if (!querySnapshot.empty) {
                    const profile = querySnapshot.docs[0].data(); // Get profile data
                    setProfileData(profile); // Set profile data in state
                    checkFriendshipStatus(loggedInUserId, profile.userId); // Check friendship status with the logged-in user
                    fetchExperiences(profile.userId); // Fetch user experiences
                    fetchJobPosts(profile.userId); // Fetch user job posts
                    fetchSocialPosts(profile.userId); // Fetch user social posts
                } else {
                    throw new Error("User not found"); // Error if user is not found
                }
            } catch (err) {
                console.error("Error fetching profile:", err); // Log error if fetching fails
                setError(err.message); // Set error message
            } finally {
                setLoading(false); // Set loading to false once data is fetched
            }
        };

        // Function to fetch user experiences
        const fetchExperiences = async (profileUserId) => {
            try {
                const experienceQuery = query(collection(db, "experience"), where("userId", "==", profileUserId));
                const experienceSnapshot = await getDocs(experienceQuery);
                const experiences = experienceSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setExperienceData(experiences); // Set experience data in state
            } catch (err) {
                console.error("Error fetching experiences:", err); // Log error if fetching fails
            }
        };

        // Function to fetch user job posts
        const fetchJobPosts = async (profileUserId) => {
            try {
                const jobsQuery = query(collection(db, "jobs"), where("userId", "==", profileUserId));
                const jobsSnapshot = await getDocs(jobsQuery);
                const jobs = jobsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setJobPosts(jobs); // Set job posts data in state
            } catch (err) {
                console.error("Error fetching job posts:", err); // Log error if fetching fails
            }
        };

        // Function to fetch user social posts
        const fetchSocialPosts = async (profileUserId) => {
            try {
                const postsQuery = query(collection(db, "posts"), where("userId", "==", profileUserId));
                const postsSnapshot = await getDocs(postsQuery);
                const posts = postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setSocialPosts(posts); // Set social posts data in state
            } catch (err) {
                console.error("Error fetching social posts:", err); // Log error if fetching fails
            }
        };

        // Function to check friendship status between the logged-in user and the profile user
        const checkFriendshipStatus = async (loggedInUserId, profileUserId) => {
            try {
                if (loggedInUserId === profileUserId) return; // Skip if user is viewing their own profile

                const connectionsQuery = query(
                    collection(db, "Connections"),
                    where("user_id", "in", [loggedInUserId, profileUserId]),
                    where("connected_user_id", "in", [loggedInUserId, profileUserId])
                );
                const snapshot = await getDocs(connectionsQuery);
                if (!snapshot.empty) {
                    const connection = snapshot.docs[0].data();
                    if (connection.status === "blocked") {
                        // Set block status if connection is blocked
                        if (connection.user_id === loggedInUserId) {
                            setBlockStatus("blocked");
                        } else {
                            setBlockStatus("blockedByOther");
                        }
                    } else {
                        setFriendshipStatus(connection.status); // Set friendship status
                    }
                }
            } catch (err) {
                console.error("Error checking friendship status:", err); // Log error if checking fails
            }
        };

        fetchProfile(); // Call the function to fetch profile data
    }, [username, loggedInUserId]);  // Re-run effect when the username parameter changes

    // Handler function to send a friend request
    const handleAddFriend = async () => {
        try {
            const connectionsCollectionRef = collection(db, "Connections");
            const newConnection = {
                user_id: loggedInUserId,
                connected_user_id: profileData.userId,
                status: "pending", // Friend request status is pending
                created_at: new Date(),
            };
            await addDoc(connectionsCollectionRef, newConnection); // Add new connection document
            setFriendshipStatus("pending"); // Update friendship status
        } catch (err) {
            console.error("Error sending friend request:", err); // Log error if sending fails
        }
    };

    // Handler function to remove a friend
    const handleRemoveFriend = async () => {
        try {
            const connectionsQuery = query(
                collection(db, "Connections"),
                where("user_id", "in", [loggedInUserId, profileData.userId]),
                where("connected_user_id", "in", [loggedInUserId, profileData.userId])
            );
            const snapshot = await getDocs(connectionsQuery);
            if (!snapshot.empty) {
                const docId = snapshot.docs[0].id;
                await deleteDoc(doc(db, "Connections", docId)); // Delete connection document to remove friend
                setFriendshipStatus(null); // Reset friendship status
            }
        } catch (err) {
            console.error("Error removing friend:", err); // Log error if removal fails
        }
    };

    // Handler function to block a user
    const handleBlock = async () => {
        try {
            const connectionsCollectionRef = collection(db, "Connections");
            const existingConnectionQuery = query(
                connectionsCollectionRef,
                where("user_id", "in", [loggedInUserId, profileData.userId]),
                where("connected_user_id", "in", [loggedInUserId, profileData.userId])
            );
            const snapshot = await getDocs(existingConnectionQuery);

            if (!snapshot.empty) {
                const docId = snapshot.docs[0].id;
                await deleteDoc(doc(db, "Connections", docId)); // Remove existing relationship if any
            }

            await addDoc(connectionsCollectionRef, {
                user_id: loggedInUserId,
                connected_user_id: profileData.userId,
                status: "blocked", // Set status as blocked
                created_at: new Date(),
            });
            setBlockStatus("blocked"); // Set block status in state
        } catch (err) {
            console.error("Error blocking user:", err); // Log error if blocking fails
        }
    };

    // Handler function to unblock a user
    const handleUnblock = async () => {
        try {
            const connectionsQuery = query(
                collection(db, "Connections"),
                where("user_id", "==", loggedInUserId),
                where("connected_user_id", "==", profileData.userId),
                where("status", "==", "blocked")
            );
            const snapshot = await getDocs(connectionsQuery);
            if (!snapshot.empty) {
                const docId = snapshot.docs[0].id;
                await deleteDoc(doc(db, "Connections", docId)); // Delete connection document to unblock
                setBlockStatus(null); // Reset block status
            }
        } catch (err) {
            console.error("Error unblocking user:", err); // Log error if unblocking fails
        }
    };

    // Conditional rendering based on different states (loading, error, etc.)
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

    // If the user is blocked by another user, show a warning
    if (blockStatus === "blockedByOther") {
        return (
            <Container className="d-flex justify-content-center align-items-center vh-100">
                <Alert variant="danger">
                    You are blocked from viewing this profile.
                </Alert>
            </Container>
        );
    }

    // Check if the current user is viewing their own profile
    const isCurrentUserProfile = loggedInUserId === profileData.userId;

    return (
        <Container className="profile-container d-flex flex-column justify-content-center align-items-center">
            {/* Profile image */}
            <div className="profile-image-wrapper">
                <img
                    src={profileData.profileImageUrl || `https://ui-avatars.com/api/?name=${profileData.firstName}+${profileData.lastName}&background=177b7b&color=ffffff`}
                    alt={`${profileData.firstName} ${profileData.lastName}`}
                    className="profile-image"
                />
            </div>

            {/* Profile information */}
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
            </Card>

            {/* Action buttons (add friend, block/unblock) */}
            {!isCurrentUserProfile && (
                <div className="action-buttons">
                    {blockStatus === "blocked" ? (
                        <Button variant="warning" className="mt-3" onClick={handleUnblock}>
                            Unblock User
                        </Button>
                    ) : (
                        <>
                            <Button
                                className="follow-button mt-3"
                                onClick={handleAddFriend}
                                disabled={friendshipStatus === "pending"}
                            >
                                {friendshipStatus === "friends" && "Remove Friend"}
                                {friendshipStatus === "pending" && "Request Pending"}
                                {friendshipStatus === null && "Add Friend"}
                            </Button>
                            <Button variant="danger" className="mt-3" onClick={handleBlock}>
                                Block User
                            </Button>
                        </>
                    )}
                </div>
            )}
                        {/* Remove Friend Confirmation Modal */}
            <Modal
                show={showRemoveFriendModal}
                onHide={() => setShowRemoveFriendModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Remove Friend</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to remove this person from your friends list?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowRemoveFriendModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => {
                            handleRemoveFriend(); // Call the function to remove the friend
                            setShowRemoveFriendModal(false); // Close modal after action
                        }}
                    >
                        Remove Friend
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ProfilePage;
