import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Container, Spinner, Alert, Card, Button, Modal } from "react-bootstrap";
import "../styles/ProfilePage.css";

const ProfilePage = () => {
    const { username } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [friendshipStatus, setFriendshipStatus] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [experienceData, setExperienceData] = useState([]);
    const [jobPosts, setJobPosts] = useState([]);
    const [socialPosts, setSocialPosts] = useState([]);
    const [showRemoveFriendModal, setShowRemoveFriendModal] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const auth = getAuth();
                const loggedInUserId = auth.currentUser?.uid;
                setCurrentUserId(loggedInUserId);

                const userQuery = query(collection(db, "users"), where("username", "==", username));
                const querySnapshot = await getDocs(userQuery);

                if (!querySnapshot.empty) {
                    const profile = querySnapshot.docs[0].data();
                    setProfileData(profile);
                    checkFriendshipStatus(loggedInUserId, profile.userId);
                    fetchExperiences(profile.userId);
                    fetchJobPosts(profile.userId);
                    fetchSocialPosts(profile.userId);
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

        const fetchExperiences = async (profileUserId) => {
            try {
                const experienceQuery = query(collection(db, "experience"), where("userId", "==", profileUserId));
                const experienceSnapshot = await getDocs(experienceQuery);
                const experiences = experienceSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setExperienceData(experiences);
            } catch (err) {
                console.error("Error fetching experiences:", err);
            }
        };

        const fetchJobPosts = async (profileUserId) => {
            try {
                const jobsQuery = query(collection(db, "jobs"), where("userId", "==", profileUserId));
                const jobsSnapshot = await getDocs(jobsQuery);
                const jobs = jobsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setJobPosts(jobs);
            } catch (err) {
                console.error("Error fetching job posts:", err);
            }
        };

        const fetchSocialPosts = async (profileUserId) => {
            try {
                const postsQuery = query(collection(db, "posts"), where("userId", "==", profileUserId));
                const postsSnapshot = await getDocs(postsQuery);
                const posts = postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setSocialPosts(posts);
            } catch (err) {
                console.error("Error fetching social posts:", err);
            }
        };

        const checkFriendshipStatus = async (loggedInUserId, profileUserId) => {
            try {
                if (loggedInUserId === profileUserId) return;
                const connectionsQuery = query(
                    collection(db, "Connections"),
                    where("user_id", "in", [loggedInUserId, profileUserId]),
                    where("connected_user_id", "in", [loggedInUserId, profileUserId])
                );
                const snapshot = await getDocs(connectionsQuery);
                if (!snapshot.empty) {
                    const connection = snapshot.docs[0].data();
                    setFriendshipStatus(connection.status);
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
                created_at: new Date(),
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
        <Container className="profile-container d-flex flex-column justify-content-center align-items-center">
            {/* Profile Picture */}
            <div className="profile-image-wrapper">
                <img
                    src={profileData.profileImageUrl || `https://ui-avatars.com/api/?name=${profileData.firstName}+${profileData.lastName}&background=177b7b&color=ffffff`}
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
                {currentUserId && profileData && !isCurrentUserProfile && (
                    <Button
                        className="follow-button mt-3"
                        onClick={() => setShowRemoveFriendModal(true)}
                        disabled={friendshipStatus === "pending"}
                    >
                        {friendshipStatus === "friends" && "Remove Friend"}
                        {friendshipStatus === "pending" && "Request Pending"}
                        {friendshipStatus === null && "Add Friend"}
                    </Button>
                )}
                {/* Remove Friend Modal */}
                <Modal
                    show={showRemoveFriendModal}
                    onHide={() => setShowRemoveFriendModal(false)}
                    centered
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Remove Friend</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to remove <strong>{profileData.firstName} {profileData.lastName}</strong> as a friend?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowRemoveFriendModal(false)}>
                            Cancel
                        </Button>
                        <Button 
                            variant="danger" 
                            onClick={() => {
                                handleRemoveFriend();
                                setShowRemoveFriendModal(false);
                            }}
                        >
                            Remove Friend
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Card>

            {/* Experience Section */}
            <div className="mt-4 w-100">
                {experienceData.map((experience) => (
                    <Card key={experience.id} className="mb-3 shadow-sm">
                        <Card.Body>
                            <Card.Title>{experience.title}</Card.Title>
                            <Card.Subtitle className="text-muted">
                                {experience.company} | {experience.current ? "Current" : "Past"}
                            </Card.Subtitle>
                            <Card.Text className="mt-2">{experience.description}</Card.Text>
                        </Card.Body>
                    </Card>
                ))}
            </div>

            {/* Job Posts Section */}
            <div className="mt-4 w-100">
                <h4>Job Posts</h4>
                {jobPosts.map((job) => (
                    <Card key={job.id} className="mb-3 shadow-sm">
                        <Card.Body>
                            <Card.Title>{job.jobTitle}</Card.Title>
                            <Card.Subtitle className="text-muted">
                                {job.location} | {job.jobType}
                            </Card.Subtitle>
                            <Card.Text className="mt-2">
                                Workers Needed: {job.numOfWorkers} | Pay: ${job.payRange.min} - $
                                {job.payRange.max}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                ))}
            </div>

            {/* Social Posts Section */}
            <div className="mt-4 w-100">
                <h4>Social Posts</h4>
                {socialPosts.map((post) => (
                    <Card key={post.id} className="mb-3 shadow-sm">
                        <Card.Body>
                            <Card.Title>{post.title}</Card.Title>
                            <Card.Text>{post.content}</Card.Text>
                            <Card.Footer className="text-muted">
                                {post.likeCount} Likes | {post.commentCount} Comments
                            </Card.Footer>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </Container>
    );
};

export default ProfilePage;
