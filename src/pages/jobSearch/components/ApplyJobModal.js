import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import 'common/components/filtersModal/FiltersModal.css';
import { getAuth } from "firebase/auth"; // Firebase authentication
import { db } from "firebaseConfig"; // Firestore configuration
import { collection, addDoc } from 'firebase/firestore';
import { useFirebaseDocument } from 'common/hooks/useFirebase';


const ExperienceSelectionModal = ({ show, experiences, onSelect, onClose }) => {
    const [selectedIds, setSelectedIds] = useState([]);

    const handleSelection = (id) => {
        setSelectedIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
    };

    const handleConfirm = () => {
        onSelect(selectedIds);
        onClose();
    };

    const formatDate = (date) => {
        if (!date) return 'Present';
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' }).format(date);
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Select Experiences</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {experiences.map((exp) => (
                    <div key={exp.id} className="experience-item">
                        <Form.Check
                            type="checkbox"
                            id={`experience-${exp.id}`}
                            label={`${exp.title} at ${exp.company} (${formatDate(exp.startDate)} - ${formatDate(exp.endDate)})`}
                            onChange={() => handleSelection(exp.id)}
                            checked={selectedIds.includes(exp.id)}
                        />
                    </div>
                ))}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Close</Button>
                <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
            </Modal.Footer>
        </Modal>
    );
};

const ApplyingJobModal = ({ jobId, jobTitle, show, onClose, creatorId }) => {
    const [motivationText, setMotivation] = useState('');
    const [yearsOfExperience, setYearsOfExperience] = useState('');
    const [toggleData, setToggleData] = useState(false);
    const [userData, setUserData] = useState({ firstName: '', lastName: '', headline: '', location: '' });
    const [experiences, setExperiences] = useState([]); // Experience list
    const [selectedExperiences, setSelectedExperiences] = useState([]);
    const [experienceModalVisible, setExperienceModalVisible] = useState(false);
    const auth = getAuth();
    const { getDocumentsByUserId } = useFirebaseDocument('experience');
    const { getDocument } = useFirebaseDocument('users');


    const currentUserId = auth.currentUser?.uid;

    useEffect(() => {
        if (!show) {
            setMotivation('');
            setYearsOfExperience('0');
            setToggleData(false);
            setUserData({ firstName: '', lastName: '', headline: '', location: '' });
            setSelectedExperiences([]);
        } else {
            const fetchUserData = async () => {
                try {
                    const document = await getDocument("users", currentUserId);
                    setUserData({
                        firstName: document.firstName || '',
                        lastName: document.lastName || '',
                        headline: document.headline || '',
                        location: document.location || ''
                    });
                } catch (error) {
                    console.error("Error fetching users:", error);
                }
            };
            fetchUserData();
        }
    }, [show]);

    const fetchUserExperiences = async () => {
        try {
            const documents = await getDocumentsByUserId("experience", currentUserId);
            setExperiences(documents);
            setExperienceModalVisible(true);
        } catch (error) {
            console.error("Error fetching user experiences:", error);
        }
    };

    const handleApply = async () => {
        const application = {
            jobPostingId: jobId,
            jobTitle,
            applicantId: currentUserId,
            yearsOfExperience,
            motivationText,
            appliedAt: new Date(),
            creatorId,
            status: "Pending",
            firstName: userData.firstName,
            lastName: userData.lastName,
            headline: userData.headline,
            location: userData.location
        };

        try {
            const docRef = await addDoc(collection(db, 'applications'), application);
            // Save experiences separately
            selectedExperiences.forEach(async (expId) => {
                const selectedExperience = experiences.find((exp) => exp.id === expId);
                console.log("selectedExperience: ", selectedExperience.title);

                const appexpdocRef = await addDoc(collection(db, 'application_experiences'), {
                    applicationId: docRef.id,
                    experienceId: expId,
                    title: selectedExperience.title,
                    company: selectedExperience.company,
                    startDate: selectedExperience.startDate,
                    endDate: selectedExperience.endDate,
                });
                console.log("application_experiences created with ID: ", appexpdocRef.id);
            });

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
                <Form.Group>
                    <Form.Label>Why am I applying?</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Tell us why you're applying..."
                        value={motivationText}
                        onChange={(e) => setMotivation(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mt-3">
                    <Form.Label>Years of experience?</Form.Label>
                    <Form.Control
                        type="number"
                        min="0"
                        placeholder="Ex: 5 for 5 years of experience"
                        value={yearsOfExperience}
                        onChange={(e) => setYearsOfExperience(e.target.value)}
                    />
                </Form.Group>

                <Form.Check
                    className="mt-3"
                    type="switch"
                    id="change-data-toggle"
                    label="Change my data"
                    checked={toggleData}
                    onChange={() => setToggleData(!toggleData)}
                />

                {toggleData && (
                    <div className="mt-3">
                        <Form.Group>
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={userData.firstName}
                                onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={userData.lastName}
                                onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Headline</Form.Label>
                            <Form.Control
                                type="text"
                                value={userData.headline}
                                onChange={(e) => setUserData({ ...userData, headline: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                                type="text"
                                value={userData.location}
                                onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                            />
                        </Form.Group>
                    </div>
                )}

                <Button
                    className="mt-3"
                    variant="outline-primary"
                    onClick={() => fetchUserExperiences()}
                >
                    Choose experiences you want to send
                </Button>
                {selectedExperiences.length > 0 && (
                    <div className="mt-2">{selectedExperiences.length} experiences chosen</div>
                )}

                <ExperienceSelectionModal
                    show={experienceModalVisible}
                    experiences={experiences}
                    onSelect={setSelectedExperiences}
                    onClose={() => setExperienceModalVisible(false)}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Close</Button>
                <Button variant="primary" onClick={handleApply}>Send Application</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ApplyingJobModal;
