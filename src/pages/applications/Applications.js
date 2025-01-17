import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { db } from "firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ReceivedApplications from "./components/appReceived";



const ApplicationsPage = () => {
    const [submittedApplications, setSubmittedApplications] = useState([]); // Applications submitted by the user
    const [receivedApplications, setReceivedApplications] = useState([]); // Applications received by the user (job creator)
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [currentUserId, setCurrentUserId] = useState(null); // User's ID

    useEffect(() => {
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUserId(user.uid); // Set the current user ID
                fetchApplications(user.uid); // Fetch applications once user is authenticated
            } else {
                setCurrentUserId(null);
                setSubmittedApplications([]);
                setReceivedApplications([]);
                setLoading(false);
                setError("User is not logged in.");
            }
        });

        return () => unsubscribe(); // Clean up listener on component unmount
    }, []);

    const fetchApplications = async (userId) => {
        setLoading(true);
        try {
            // Fetch applications submitted by the user
            const applicationsCollectionRef = collection(db, "applications");
            const submittedQuery = query(
                applicationsCollectionRef,
                where("applicantId", "==", userId)
            );

            const submittedSnapshot = await getDocs(submittedQuery);
            const submittedData = submittedSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Fetch applications received by the user (for jobs they created)
            const receivedQuery = query(
                applicationsCollectionRef,
                where("creatorId", "==", userId)
            );

            const receivedSnapshot = await getDocs(receivedQuery);
            const receivedData = receivedSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setSubmittedApplications(submittedData);
            setReceivedApplications(receivedData);
            setError(null); // Reset error state
        } catch (err) {
            console.error("Error fetching applications:", err);
            setError("Failed to fetch applications. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="applications-page">
            <h1 className="my-4">Applications</h1>
            {loading ? (
                <p>Loading applications...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <>
                    {/* Submitted Applications Section */}
                    <section className="submitted-applications">
                        <h2>Submitted Applications</h2>
                        {submittedApplications.length > 0 ? (
                            <Row>
                                {submittedApplications.map(app => (
                                    <Col key={app.id} sm={12} md={6} lg={4} className="mb-3">
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>Job Name: {app.jobTitle}</Card.Title>
                                                <Card.Text>
                                                    <strong>Motivation:</strong> {app.motivationText}
                                                </Card.Text>
                                                <Card.Text>
                                                    <strong>Years of Experience:</strong> {app.yearsOfExperience}
                                                </Card.Text>
                                                <Card.Text>
                                                    <strong>Status:</strong> {app.status}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <p>No applications submitted yet.</p>
                        )}
                    </section>

                    <hr />

                    {/* Received Applications Section */}
                    <section className="received-applications">
                        <h2>Received Applications</h2>
                        <ReceivedApplications applications={receivedApplications} />
                        {/* {receivedApplications.length > 0 ? (
                            <Row>
                                {receivedApplications.map(app => (
                                    <Col key={app.id} sm={12} md={6} lg={4} className="mb-3">
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>Applicant ID: {app.applicantId}</Card.Title>
                                                <Card.Text>
                                                    <strong>Motivation:</strong> {app.motivationText}
                                                </Card.Text>
                                                <Card.Text>
                                                    <strong>Years of Experience:</strong> {app.yearsOfExperience}
                                                </Card.Text>
                                                <Card.Text>
                                                    <strong>Status:</strong> {app.status}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <p>No applications received yet.</p>
                        )} */}
                    </section>
                </>
            )}
        </Container>
    );
};

export default ApplicationsPage;
