import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Container, Spinner, Alert, Card, Button } from "react-bootstrap";
import '../styles/ProfilePage.css';

const ProfilePage = () => {
    const { username } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userQuery = query(
                    collection(db, "users"),
                    where("username", "==", username)
                );
                const querySnapshot = await getDocs(userQuery);

                if (!querySnapshot.empty) {
                    const profile = querySnapshot.docs[0].data();
                    setProfileData(profile);
                    fetchExperiences(profile.userId); // Fetch experiences using the userId
                } else {
                    throw new Error("User not found");
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        const fetchExperiences = async (userId) => {
            try {
                const experiencesQuery = query(
                    collection(db, "experience"),
                    where("userId", "==", userId)
                );
                const querySnapshot = await getDocs(experiencesQuery);

                const experiencesData = querySnapshot.docs.map(doc => doc.data());
                setExperiences(experiencesData);
            } catch (err) {
                console.error("Error fetching experiences:", err);
                setError("Could not fetch experiences.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username]);

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
                {/* Follow Button */}
                <Button 
                    className="follow-button mt-3"
                    onClick={() => console.log('Follow button clicked!')} >
                    Follow
                </Button>
            </Card>

            {/* Experiences Section */}
            <Card className="experiences mt-3 shadow-sm w-100">
                <Card.Body>
                    <Card.Title className="text-center">Experiences</Card.Title>
                    {experiences.length === 0 ? (
                        <p className="text-center text-muted">No experiences to display.</p>
                    ) : (
                        experiences.map((experience) => (
                            <div key={experience.id} className="experience-item mb-3">
                                <h5>{experience.title} at {experience.company}</h5>
                                <p className="text-muted">
                                    {new Date(experience.startDate.seconds * 1000).toLocaleDateString()} -{" "}
                                    {experience.current 
                                        ? "Present" 
                                        : new Date(experience.endDate.seconds * 1000).toLocaleDateString()}
                                </p>
                                <p>{experience.description}</p>
                            </div>
                        ))
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ProfilePage;
