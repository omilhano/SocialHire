import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import '../styles/FiltersModal.css';

const SearchModal = ({ show, onClose }) => {
    // State to hold selected values for each dropdown
    const [jobType, setJobType] = useState('Choose Type of Job');
    const [location, setLocation] = useState('Choose Location');
    const [numOfPeople, setNumOfPeople] = useState('Choose Nº of people');

    // Reset the state when the modal is closed
    useEffect(() => {
        if (!show) {
            // Reset states to initial values when modal is closed
            setJobType('Choose Type of Job');
            setLocation('Choose Location');
            setNumOfPeople('Choose Nº of people');
        }
    }, [show]); // Only run when 'show' changes

    // Functions to handle selection changes
    const handleJobTypeSelect = (value) => setJobType(value);
    const handleLocationSelect = (value) => setLocation(value);
    const handleNumOfPeopleSelect = (value) => setNumOfPeople(value);

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Filters</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Add your filter options here.

                {/* Job Type Dropdown */}
                <Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                        {jobType}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleJobTypeSelect('Formal')}>Formal</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleJobTypeSelect('Informal')}>Informal</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                {/* Location Dropdown */}
                <Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                        {location}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleLocationSelect('Lisbon Area')}>Lisbon Area</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleLocationSelect('Porto Area')}>Porto Area</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleLocationSelect('Algarve Area')}>Algarve Area</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                {/* Number of People Dropdown */}
                <Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                        {numOfPeople}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleNumOfPeopleSelect('1')}>1</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleNumOfPeopleSelect('2')}>2</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleNumOfPeopleSelect('3+')}>3+</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={onClose}>
                    Apply Filters
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SearchModal;
