import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from 'firebaseConfig';
import RatingModal from './ratingModal';

const ReceivedApplications = ({ applications }) => {
    const [showModal, setShowModal] = useState(false);
    const [currentApplication, setCurrentApplication] = useState(null); // Store the full application
    const navigate = useNavigate();

    const viewProfile = async (applicantId) => {
        try {
            const userDoc = doc(db, 'users', applicantId);
            const userSnap = await getDoc(userDoc);

            if (userSnap.exists()) {
                const username = userSnap.data().username;
                navigate(`/profile/${username}`);
            } else {
                alert('User not found!');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            alert('An error occurred while fetching the user data.');
        }
    };

    const changeApplicationStatus = async (application, newStatus) => {
        try {
            const applicationDoc = doc(db, 'applications', application.id);

            if (newStatus === 'Rejected') {
                // Handle rejection: delete the application
                await deleteDoc(applicationDoc);
                alert('Application rejected and deleted successfully!');
            } else {
                // Update the application status
                await updateDoc(applicationDoc, { status: newStatus });
                alert(`Application status changed to ${newStatus} successfully!`);

                // Open the modal when the status is 'Finished' and set the current application
                if (newStatus === 'Finished') {
                    setCurrentApplication(application);  // Set the full application data
                    setShowModal(true);  // Show the modal
                }
            }
        } catch (error) {
            console.error('Error handling application:', error);
            alert('Failed to update or delete the application.');
        }
    };

    const handleRatingSubmit = async ({ rating, feedback }) => {
        try {
            const applicationDoc = doc(db, 'applications', currentApplication.id);
            await updateDoc(applicationDoc, {
                status: 'Finished',
                rating,
                feedback,
            });
            alert('Job finished and rating submitted successfully!');
            setShowModal(false); // Close the modal
            window.location.reload();
        } catch (error) {
            console.error('Error submitting rating:', error);
            alert('Failed to submit the rating.');
        }
    };

    return (
        <div className="received-applications container mt-4">
            {applications && applications.length > 0 ? (
                <div className="row">
                    {applications.map((app, index) => (
                        <div className="col-md-4 mb-4" key={index}>
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">Applicant ID: {app.applicantId}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">{app.jobTitle}</h6>
                                    <p className="card-text">{app.motivationText}</p>
                                    <p className="card-text">Years of experience: {app.yearsOfExperience}</p>
                                    <p className="card-text">Status: {app.status}</p>
                                </div>
                                <div className="card-footer text-center">
                                    <Button
                                        variant="primary"
                                        className="btn btn-primary btn-sm"
                                        onClick={() => viewProfile(app.applicantId)}
                                    >
                                        View Profile
                                    </Button>
                                    {app.status === 'Pending' && (
                                        <>
                                            <Button
                                                variant="success"
                                                className="btn btn-secondary btn-sm ms-2"
                                                onClick={() => changeApplicationStatus(app, 'Approved')}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="danger"
                                                className="btn btn-danger btn-sm ms-2"
                                                onClick={() => changeApplicationStatus(app, 'Rejected')}
                                            >
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                    {app.status === 'Approved' && (
                                        <Button
                                            variant="warning"
                                            className="btn btn-warning btn-sm ms-2"
                                            onClick={() => changeApplicationStatus(app, 'Finished')}
                                        >
                                            Finish Job
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No applications received yet.</p>
            )}
            {currentApplication && (
                <RatingModal
                    app={currentApplication} // Pass the full application object
                    show={showModal}
                    onClose={() => setShowModal(false)} // Close the modal
                    onSubmit={handleRatingSubmit}
                />
            )}
        </div>
    );
};

export default ReceivedApplications;
