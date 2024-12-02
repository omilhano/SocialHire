import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import '../styles/FiltersModal.css';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

// TODO finish this

const CreatingJobModal = ({ show, onClose }) => {
    const [jobType, setJobType] = useState('Choose Type of Job');
    const [pricePerHour, setPricePerHour] = useState(0);
    const [jobTitle, setJobTitle] = useState('');
    const [location, setLocation] = useState('');
    const [payRange, setPayRange] = useState({ min: '', max: '' });
    const [jobDescription, setJobDescription] = useState('');
    const [jobExpectedTime, setJobExpectedTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [newRequirement, setNewRequirement] = useState('');
    const [additionalRequirements, setAdditionalRequirements] = useState([]);
    const [newBenefits, setNewBenefit] = useState('');
    const [additionalBenefits, setAdditionalBenefits] = useState([]);
    const [newjobRequirement, setNewJobRequirement] = useState('');
    const [additionalJobRequirements, setAdditionalJobRequirements] = useState([]);
    const [newFavouredSkill, setNewFavouredSkill] = useState('');
    const [favouredSkills, setFavouredSkills] = useState([]);

    const { user } = useAuth();

    // Reset state when modal is closed
    useEffect(() => {
        if (!show) {
            setJobType('Choose Type of Job');
            setPricePerHour(0);
            setJobTitle('');
            setLocation('');
            setPayRange({ min: '', max: '' });
            setJobDescription('');
            setJobExpectedTime('');
            setEndTime(''); // Reset endTime state
        }
    }, [show]);

    const handleJobTypeSelect = (value) => {
        setJobType(value);
    };


    const handleSaveJob = async () => {
        if (!jobTitle) {
            alert("Please fill in all the required fields.");
            return;
        }

        const jobData = {
            jobType,
            jobTitle,
            createdAt: new Date(),
            userId: user?.uid,
            additionalRequirements,
            additionalJobRequirements, // Include additional requirements
            additionalBenefits,
            favouredSkills, 
        };

        if (jobType === 'Hustler') {
            jobData.pricePerHour = pricePerHour;
            jobData.jobDescription = jobDescription;
            jobData.jobExpectedTime = `${jobExpectedTime} hours`; // Append "hours"
            jobData.location = location
            jobData.endTime = endTime;
        } else if (jobType === 'Formal Job') {
            jobData.location = location;
            jobData.payRange = payRange;
            jobData.jobDescription = jobDescription;
            jobData.additionalBenefits = newBenefits;
            jobData.additionalJobRequirements = newjobRequirement;
            jobData.favouredSkills = favouredSkills
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

                {/* Decision for type if job */}
                {/* Hustler & Formal Job */}
                {jobType === 'Hustler' && (
                    <>
                        <div className="mt-3">
                            <label htmlFor="jobTitle">Job Title</label>
                            <input
                                type="text"
                                id="jobTitle"
                                className="form-control"
                                placeholder="Ex: Need Electrician"
                                value={jobTitle}
                                required
                                onChange={(e) => setJobTitle(e.target.value)}
                            />
                        </div>

                        <div className="mt-3">
                            <label htmlFor="jobDescription">Job Description</label>
                            <input
                                type="text"
                                id="jobDescription"
                                className="form-control"
                                placeholder="Ex: Fix a tv (Max 500 characters)"
                                maxLength="500"
                                value={jobDescription}
                                required
                                onChange={(e) => setJobDescription(e.target.value)}
                            />
                        </div>

                        <div className="mt-3">
                            <label htmlFor="jobExpectedTime">Expected Duration</label>
                            <input
                                type="number"
                                min="0"
                                id="jobExpectedTime"
                                className="form-control"
                                placeholder="Ex: 2 for 2 hours"
                                value={jobExpectedTime}
                                required
                                onChange={(e) => setJobExpectedTime(e.target.value)}
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
                                required
                                onChange={(e) => setPricePerHour(e.target.value)}
                            />
                        </div>

                        <div className="mt-3">
                            <label htmlFor="endTime">Expected End Time</label>
                            <input
                                type="datetime-local"
                                id="endTime"
                                className="form-control"
                                value={endTime}
                                required
                                onChange={(e) => setEndTime(e.target.value)}
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
                                required
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>


                        {/* Array of the job's requirements */}
                        <div className="mt-3">
                            <label htmlFor="additionalRequirements">Additional Requirements</label>
                            <div className="d-flex gap-2 align-items-start">
                                <input
                                    type="text"
                                    id="additionalRequirements"
                                    className="form-control"
                                    placeholder="Ex: Driver’s license"
                                    maxLength="100"
                                    value={newRequirement}
                                    onChange={(e) => setNewRequirement(e.target.value)}
                                />
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        if (newRequirement.trim() && newRequirement.length <= 100) {
                                            setAdditionalRequirements([...additionalRequirements, newRequirement.trim()]);
                                            setNewRequirement('');
                                        } else {
                                            alert("Please enter a valid requirement (max 100 characters).");
                                        }
                                    }}
                                >
                                    Add
                                </button>
                            </div>
                            <ul className="mt-2">
                                {additionalRequirements.map((requirement, index) => (
                                    <li key={index}>{requirement}</li>
                                ))}
                            </ul>
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
                                required
                                onChange={(e) => setJobTitle(e.target.value)}
                            />
                        </div>

                        <div className="mt-3">
                            <label htmlFor="jobDescription">Job Description</label>
                            <input
                                type="text"
                                id="jobDescription"
                                className="form-control"
                                placeholder="Ex: Fix a tv (Max 500 characters)"
                                maxLength="500"
                                value={jobDescription}
                                required
                                onChange={(e) => setJobDescription(e.target.value)}
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
                                required
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

                        {/* Array of the job's benefits */}
                        <div className="mt-3">
                            <label htmlFor="additionalBenefits">Additional Benefits</label>
                            <div className="d-flex gap-2 align-items-start">
                                <input
                                    type="text"
                                    id="additionalBenefits"
                                    className="form-control"
                                    placeholder="Ex: Health insurance"
                                    maxLength="250"
                                    value={newBenefits}
                                    onChange={(e) => setNewBenefit(e.target.value)}
                                />
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        if (newBenefits.trim() && newBenefits.length <= 250) {
                                            setAdditionalBenefits([...additionalBenefits, newBenefits.trim()]);
                                            setNewBenefit('');
                                        } else {
                                            alert("Please enter a valid requirement (max 100 characters).");
                                        }
                                    }}
                                >
                                    Add
                                </button>
                            </div>
                            <ul className="mt-2">
                                {additionalBenefits.map((benefits, index) => (
                                    <li key={index}>{benefits}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Array of the job's requirements */}
                        <div className="mt-3">
                            <label htmlFor="jobRequirements">Requirements: </label>
                            <div className="d-flex gap-2 align-items-start">
                                <input
                                    type="text"
                                    id="jobRequirements"
                                    className="form-control"
                                    placeholder="Ex: Proficiency in Python "
                                    maxLength="250"
                                    value={newjobRequirement}
                                    onChange={(e) => setNewJobRequirement(e.target.value)}
                                />
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        if (newjobRequirement.trim() && newjobRequirement.length <= 250) {
                                            setAdditionalJobRequirements([...additionalJobRequirements, newjobRequirement.trim()]);
                                            setNewJobRequirement('');
                                        } else {
                                            alert("Please enter a valid requirement (max 100 characters).");
                                        }
                                    }}
                                >
                                    Add
                                </button>
                            </div>
                            <ul className="mt-2">
                                {additionalJobRequirements.map((jobRequirements, index) => (
                                    <li key={index}>{jobRequirements}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Array of the job's favored skills */}
                        <div className="mt-3">
                            <label htmlFor="favouredSkills">Favored Skills: </label>
                            <div className="d-flex gap-2 align-items-start">
                                <input
                                    type="text"
                                    id="favouredSkills"
                                    className="form-control"
                                    placeholder="Ex: Communication, Leadership"
                                    maxLength="250"
                                    value={newFavouredSkill}
                                    onChange={(e) => setNewFavouredSkill(e.target.value)}
                                />
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        if (newFavouredSkill.trim() && newFavouredSkill.length <= 250) {
                                            setFavouredSkills([...favouredSkills, newFavouredSkill.trim()]);
                                            setNewFavouredSkill('');
                                        } else {
                                            alert("Please enter a valid skill (max 250 characters).");
                                        }
                                    }}
                                >
                                    Add
                                </button>
                            </div>
                            <ul className="mt-2">
                                {favouredSkills.map((skill, index) => (
                                    <li key={index}>{skill}</li>
                                ))}
                            </ul>
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
