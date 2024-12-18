import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

/* TODO ADD COMMENTS
   CHANGE STRUCTURE
*/


const ApplicationsPage = () => {
    const [submittedApplications, setSubmittedApplications] = useState([]); // Applications submitted by the user
    const [receivedApplications, setReceivedApplications] = useState([]); // Applications received by the user (job creator)
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        const fetchApplications = async () => {
            setLoading(true);
            try {
                const auth = getAuth(); // Initialize Firebase Auth
                const currentUserId = auth.currentUser?.uid; // Get the logged-in user's ID
                if (!currentUserId) {
                    console.error("No user is logged in.");
                    setError("User is not logged in.");
                    setLoading(false);
                    return;
                }

                // Fetch applications submitted by the user
                const applicationsCollectionRef = collection(db, 'applications');
                const submittedQuery = query(
                    applicationsCollectionRef,
                    where("applicantId", "==", currentUserId) // Filter for applications submitted by the user
                );

                const submittedSnapshot = await getDocs(submittedQuery);
                const submittedData = submittedSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // Fetch applications received by the user (for jobs they created)
                const receivedQuery = query(
                    applicationsCollectionRef,
                    where("creatorId", "==", currentUserId) // Filter for applications received for user's jobs
                );

                const receivedSnapshot = await getDocs(receivedQuery);
                const receivedData = receivedSnapshot.docs.map(doc => ({
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

        fetchApplications(); // Fetch applications when component mounts
    }, []);

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
                        {receivedApplications.length > 0 ? (
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
                        )}
                    </section>
                </>
            )}
        </Container>
    );
};

export default ApplicationsPage;
