import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Spinner, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { doc as firestoreDoc, getDoc, updateDoc, deleteDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from 'firebaseConfig';
import RatingModal from './ratingModal';

const ReceivedApplications = ({ applications }) => {
    const [applicantNames, setApplicantNames] = useState({});
    const [applicationExperiences, setApplicationExperiences] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [currentApplication, setCurrentApplication] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplicantData = async () => {
            const names = {};
            const experiences = {};

            for (const app of applications) {
                try {
                    const userDoc = firestoreDoc(db, 'users', app.applicantId);
                    const userSnap = await getDoc(userDoc);
                    if (userSnap.exists()) {
                        const { firstName, lastName } = userSnap.data();
                        names[app.applicantId] = { firstName, lastName };
                    } else {
                        names[app.applicantId] = { firstName: 'Unknown', lastName: 'User' };
                    }

                    const expQuery = query(
                        collection(db, 'application_experiences'),
                        where('applicationId', '==', app.id)
                    );
                    const expSnap = await getDocs(expQuery);
                    experiences[app.id] = expSnap.docs.map(expDoc => expDoc.data());
                } catch (error) {
                    console.error('Error fetching application data:', error);
                }
            }

            setApplicantNames(names);
            setApplicationExperiences(experiences);
        };

        if (applications && applications.length > 0) {
            fetchApplicantData();
        }
    }, [applications]);

    const viewProfile = async (applicantId) => {
        try {
            const userDoc = firestoreDoc(db, 'users', applicantId);
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
            const applicationDoc = firestoreDoc(db, 'applications', application.id);

            if (newStatus === 'Rejected') {
                await deleteDoc(applicationDoc);
                alert('Application rejected and deleted successfully!');
                window.location.reload();
            } else {
                await updateDoc(applicationDoc, { status: newStatus });
                alert(`Application status changed to ${newStatus} successfully!`);
                if (newStatus === 'Finished') {
                    setCurrentApplication(application);
                    setShowModal(true);
                }
            }
        } catch (error) {
            console.error('Error handling application:', error);
            alert('Failed to update or delete the application.');
        }
    };

    const handleRatingSubmit = async ({ rating, feedback }) => {
        try {
            const applicationDoc = firestoreDoc(db, 'applications', currentApplication.id);
            await updateDoc(applicationDoc, {
                status: 'Finished',
                rating,
                feedback,
            });
            alert('Job finished and rating submitted successfully!');
            setShowModal(false);
            window.location.reload();
        } catch (error) {
            console.error('Error submitting rating:', error);
            alert('Failed to submit the rating.');
        }
    };


    const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    return (
        <div className="received-applications container mt-5">
            {applications && applications.length > 0 ? (
                <div className="row">
                    {applications.map((app, index) => (
                        <div className="col-md-6 mb-4" key={index}>
                            <div className="card h-100 shadow-sm border-0">
                                <div className="card-header bg-light border-bottom">
                                    <h5 className="mb-1 text-primary">
                                        {applicantNames[app.applicantId]?.firstName || 'Loading...'}{' '}
                                        {applicantNames[app.applicantId]?.lastName || 'Loading...'}
                                    </h5>
                                    <Badge bg="secondary">{app.status}</Badge>
                                </div>
                                <div className="card-body">
                                    <h6 className="card-subtitle text-muted mb-2">{app.jobTitle}</h6>
                                    <p className="text-secondary small mb-2">Motivation: {app.motivationText}</p>
                                    <p className="text-secondary small mb-2">Location: {app.location}</p>
                                    <p className="text-secondary small">Years of Experience: {app.yearsOfExperience}</p>

                                    {applicationExperiences[app.id] ? (
                                        <div className="mt-3">
                                            <h6 className="text-primary">Related Experiences:</h6>
                                            <ul className="list-unstyled small">
                                                {applicationExperiences[app.id].map((exp, idx) => (
                                                    <li
                                                        key={`experience-${idx}`}
                                                        className="text-secondary"
                                                    >
                                                        {`${exp.title} at ${exp.company} (${formatDate(exp.startDate)} - ${formatDate(exp.endDate)})`}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <Spinner animation="border" size="sm" className="mt-3" />
                                    )}
                                </div>
                                <div className="card-footer bg-light d-flex justify-content-between">
                                    <Button
                                        variant="outline-primary"
                                        className="btn-sm"
                                        onClick={() => viewProfile(app.applicantId)}
                                    >
                                        View Profile
                                    </Button>
                                    {app.status === 'Pending' && (
                                        <>
                                            <Button
                                                variant="outline-success"
                                                className="btn-sm"
                                                onClick={() => changeApplicationStatus(app, 'Approved')}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                className="btn-sm"
                                                onClick={() => changeApplicationStatus(app, 'Rejected')}
                                            >
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                    {app.status === 'Approved' && (
                                        <Button
                                            variant="outline-warning"
                                            className="btn-sm"
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
                <p className="text-center text-muted">No applications received yet.</p>
            )}
            {currentApplication && (
                <RatingModal
                    app={currentApplication}
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleRatingSubmit}
                />
            )}
        </div>
    );
};

export default ReceivedApplications;
