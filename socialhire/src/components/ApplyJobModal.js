import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import '../styles/FiltersModal.css';
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase authentication
import { db } from "../firebaseConfig"; // Import Firestore configuration
import { collection, addDoc } from 'firebase/firestore';

const ApplyingJobModal = ({ jobId, show, onClose }) => {
    const [motivationText, setMotivation] = useState('');
    const [yearsOfExperience, setyearsOfExperience] = useState('');
    const auth = getAuth();

    const currentUserId= auth.currentUser?.uid;
    // Reset state when modal is closed
    useEffect(() => {
        if (!show) {
            setMotivation('')
            setyearsOfExperience('0');
        }
    }, [show]);

    const handleApply = async () => {
        const application = {
            jobPostingId: jobId, // Ensure `job.id` is accessible
            applicantId: currentUserId, // Replace with the logged-in user's ID
            yearsOfExperience, // Make sure `experience` is set
            motivationText, // Make sure `motivationText` is set
            appliedAt: new Date(), // Optionally add a timestamp
        };

        try {
            // Add the application document to the "applications" collection
            const docRef = await addDoc(collection(db, 'applications'), application);
            console.log("Application created with ID: ", docRef.id); // Firestore-generated ID

            // Optionally close the modal
            onClose();
        } catch (error) {
            console.error("Error submitting application: ", error);
            alert("There was an error while submitting your application.");
        }
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Application</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Motivation Input */}
                <div className="mt-3">
                    <label htmlFor="motivationText">Why am I applying?</label>
                    <input
                        type="text"
                        id="motivation-Text"
                        className="form-control"
                        placeholder="Tell us why you're applying...."
                        value={motivationText}
                        required
                        onChange={(e) => setMotivation(e.target.value)}
                    />

                    {/* Years of experience */}
                    <div className="mt-3">
                        <label htmlFor="yearsOfExperience">Years of experience?</label>
                        <input
                            type="number"
                            min="0"
                            id="yearsOfExperience"
                            className="form-control"
                            placeholder="Ex: 5 for 5 years of experience"
                            value={yearsOfExperience}
                            required
                            onChange={(e) => setyearsOfExperience(e.target.value)}
                        />
                    </div>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Close</Button>
                <Button variant="primary" onClick={handleApply}>Send Application</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ApplyingJobModal;