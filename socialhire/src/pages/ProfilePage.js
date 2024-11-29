import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap"; // Bootstrap components
import '../styles/ProfilePage.css'; // Custom styles

const ProfilePage = () => {
    const { username } = useParams(); // Extract username from URL
    const [profileData, setProfileData] = useState(null); // State for profile data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userQuery = query(
                    collection(db, "users"),
                    where("username", "==", username)
                );
                const querySnapshot = await getDocs(userQuery);

                if (!querySnapshot.empty) {
                    setProfileData(querySnapshot.docs[0].data());
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

        fetchProfile();
    }, [username]);

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    if (!profileData) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <Alert variant="warning">Profile not found</Alert>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Row>
                                {/* Profile Image */}
                                <Col xs={12} md={4} className="d-flex justify-content-center align-items-center mb-3 mb-md-0">
                                    <div className="profile-img-wrapper">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${profileData.firstName}+${profileData.lastName}&background=random`} // Dynamic placeholder image
                                            alt={`${profileData.firstName} ${profileData.lastName}`}
                                            className="rounded-circle img-fluid profile-img"
                                        />
                                    </div>
                                </Col>
                                {/* Profile Info */}
                                <Col xs={12} md={8}>
                                    <h2 className="text-primary">{profileData.firstName} {profileData.lastName}</h2>
                                    <p className="text-muted mb-1"><strong>Username:</strong> {profileData.username}</p>
                                    <p className="text-muted mb-1"><strong>Email:</strong> {profileData.email}</p>
                                    <p className="text-muted mb-1">
                                        <strong>Account Type:</strong> {profileData.accountType}
                                    </p>
                                    <p className="text-muted mb-1">
                                        <strong>Joined:</strong> {new Date(profileData.createdAt).toLocaleDateString()}
                                    </p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProfilePage;
