import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import '../styles/FiltersModal.css';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const CreatingJobModal = ({ show, onClose }) => {
    const [jobType, setJobType] = useState('Choose Type of Job');
    const [subJobType, setSubJobType] = useState(null);
    const [pricePerHour, setPricePerHour] = useState(0);
    const [numOfWorkers, setNumOfWorkers] = useState(1);
    const [jobTitle, setJobTitle] = useState('');
    const [location, setLocation] = useState('');
    const [payRange, setPayRange] = useState({ min: '', max: '' });

    const { user } = useAuth();

    // Reset state when modal is closed
    useEffect(() => {
        if (!show) {
            setJobType('Choose Type of Job');
            setSubJobType(null);
            setPricePerHour(0);
            setNumOfWorkers(1);
            setJobTitle('');
            setLocation('');
            setPayRange({ min: '', max: '' });
        }
    }, [show]);

    const handleJobTypeSelect = (value) => {
        setJobType(value);
        setSubJobType(null);
    };

    const handleSubJobTypeSelect = (value) => setSubJobType(value);

    const handleSaveJob = async () => {
        if (!jobTitle || !numOfWorkers) {
            alert("Please fill in all the required fields.");
            return;
        }

        const jobData = {
            jobType,
            jobTitle,
            numOfWorkers,
            createdAt: new Date(),
            userId: user?.uid,
        };

        if (jobType === 'Hustler') {
            jobData.subJobType = subJobType;
            jobData.pricePerHour = pricePerHour;
        } else if (jobType === 'Formal Job') {
            jobData.location = location;
            jobData.payRange = payRange;
        }

        try {
            const jobRef = await addDoc(collection(db, 'jobs'), jobData);
            console.log("Job created with ID: ", jobRef.id);
            onClose(); // Close modal after saving the job
        } catch (error) {
            console.error("Error adding job: ", error);
            alert("There was an error while saving the job.");
        }
    };

    return (
        <Modal show={show} onHide={() => onClose()}>
            <Modal.Header closeButton>
                <Modal.Title>Create Job</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Dropdown>
                    <Dropdown.Toggle variant="primary" id="jobTypeDropdown">
                        {jobType}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleJobTypeSelect('Hustler')}>Hustler</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleJobTypeSelect('Formal Job')}>Formal Job</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                {jobType === 'Hustler' && (
                    <>
                        <Dropdown>
                            <Dropdown.Toggle variant="primary" id="subJobTypeDropdown">
                                {subJobType || 'Choose Hustler Job Type'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleSubJobTypeSelect('Manual Job')}>Manual Job</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleSubJobTypeSelect('Technical Job')}>Technical Job</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        <div className="mt-3">
                            <label htmlFor="jobTitle">Job Title</label>
                            <input
                                type="text"
                                id="jobTitle"
                                className="form-control"
                                placeholder="Ex: Need Electrician"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                            />
                        </div>

                        <div className="mt-3">
                            <label htmlFor="priceSlider">Price per Hour: €{pricePerHour}</label>
                            <input
                                type="range"
                                id="priceSlider"
                                className="form-range"
                                min="0"
                                max="100"
                                step="1"
                                value={pricePerHour}
                                onChange={(e) => setPricePerHour(e.target.value)}
                            />
                        </div>

                        <div className="mt-3">
                            <label htmlFor="numOfWorkers">Number of Workers: {numOfWorkers}</label>
                            <input
                                type="number"
                                id="numOfWorkers"
                                className="form-control"
                                min="1"
                                value={numOfWorkers}
                                onChange={(e) => setNumOfWorkers(e.target.value)}
                            />
                        </div>
                    </>
                )}

                {jobType === 'Formal Job' && (
                    <>
                        <div className="mt-3">
                            <label htmlFor="jobTitle">Job Title</label>
                            <input
                                type="text"
                                id="jobTitle"
                                className="form-control"
                                placeholder="Ex: QA Engineer"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                            />
                        </div>

                        <div className="mt-3">
                            <label htmlFor="location">Location</label>
                            <input
                                type="text"
                                id="location"
                                className="form-control"
                                placeholder="Enter Location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>

                        <div className="mt-3">
                            <label>Pay Range (€)</label>
                            <div className="d-flex gap-2">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Min"
                                    value={payRange.min}
                                    onChange={(e) => setPayRange({ ...payRange, min: e.target.value })}
                                />
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Max"
                                    value={payRange.max}
                                    onChange={(e) => setPayRange({ ...payRange, max: e.target.value })}
                                />
                            </div>
                        </div>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => onClose()} id="closeButton">
                    Close
                </Button>
                <Button variant="primary" onClick={handleSaveJob} id="applyFilterButton">
                    Save Job
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreatingJobModal;
