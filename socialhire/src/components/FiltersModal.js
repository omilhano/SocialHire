import React, { useState, useEffect } from 'react';
import { Modal, Button, Dropdown, Form } from 'react-bootstrap';
import '../styles/FiltersModal.css';

// Pass on filters for parent component
const SearchModal = ({ show, onClose, filters, setFilters }) => {
    // Destructure filters for easier access and set defaults if not provided
    const { jobType, location, numOfPeople, minSalary, maxSalary } = filters || {};

    // Local state for each filter category
    const [selectedJobType, setSelectedJobType] = useState(jobType || 'Choose Type of Job');
    const [selectedLocation, setSelectedLocation] = useState(location || 'Choose Location');
    const [selectedNumOfPeople, setSelectedNumOfPeople] = useState(numOfPeople || 'Choose Nº of people');
    const [selectedMinSalary, setSelectedMinSalary] = useState(minSalary || 0);
    const [selectedMaxSalary, setSelectedMaxSalary] = useState(maxSalary || 100000);

    // Reset local state when modal is closed
    useEffect(() => {
        if (!show) {
            setSelectedJobType(jobType || 'Choose Type of Job');
            setSelectedLocation(location || 'Choose Location');
            setSelectedNumOfPeople(numOfPeople || 'Choose Nº of people');
            setSelectedMinSalary(minSalary || 0);
            setSelectedMaxSalary(maxSalary || 100000);
        }
    }, [show, jobType, location, numOfPeople, minSalary, maxSalary]);

    // Mapping dropdown values to realated Firestore values
    const jobTypeMapping = {
        'Formal': 'Formal Job',
        'Hustler': 'Hustler'
    };

    const locationMapping = {
        'Lisbon Area': 'Lisbon',
        'Porto Area': 'Porto',
        'Algarve Area': 'Algarve'
    };

    const numOfPeopleMapping = {
        '1': '1',
        '2': '2',
        '3+': '3+'
    };

    // Handlers for each dropdown
    const handleJobTypeSelect = (value) => setSelectedJobType(value);
    const handleLocationSelect = (value) => setSelectedLocation(value);
    const handleNumOfPeopleSelect = (value) => setSelectedNumOfPeople(value);

    // Handlers for salary range
    const handleMinSalaryChange = (e) => {
        setSelectedMinSalary(e.target.value);
    };
    const handleMaxSalaryChange = (e) => {
        setSelectedMaxSalary(e.target.value);
    };
    const handleMinSalarySliderChange = (e) => {
        setSelectedMinSalary(e.target.value);
    };
    const handleMaxSalarySliderChange = (e) => {
        setSelectedMaxSalary(e.target.value);
    };

    // Apply filters when the button is clicked
    const handleApplyFilters = () => {
        setFilters({
            jobType: jobTypeMapping[selectedJobType] || selectedJobType,
            location: locationMapping[selectedLocation] || selectedLocation,
            numOfPeople: numOfPeopleMapping[selectedNumOfPeople] || selectedNumOfPeople,
            minSalary: selectedMinSalary,
            maxSalary: selectedMaxSalary,
        });
        onClose(); // Close the modal after applying filters
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Filters</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Job Type Dropdown */}
                <Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown-jobType">
                        {selectedJobType}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleJobTypeSelect('Formal')}>Formal</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleJobTypeSelect('Hustler')}>Hustler</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                {/* Location Dropdown */}
                <Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown-location">
                        {selectedLocation}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleLocationSelect('Lisbon Area')}>Lisbon Area</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleLocationSelect('Porto Area')}>Porto Area</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleLocationSelect('Algarve Area')}>Algarve Area</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                {/* Number of People Dropdown */}
                <Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown-numOfPeople">
                        {selectedNumOfPeople}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleNumOfPeopleSelect('1')}>1</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleNumOfPeopleSelect('2')}>2</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleNumOfPeopleSelect('3+')}>3+</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                {/* Salary Range Inputs and Slider */}
                <div className="salary-range">
                    <h6>Salary Range</h6>
                    <Form.Group controlId="salaryRange">
                        <Form.Label>Min Salary: €{selectedMinSalary}</Form.Label>
                        {/* Number */}
                        <Form.Control
                            type="number"
                            value={selectedMinSalary}
                            onChange={handleMinSalaryChange}
                            min="0"
                            max="200000"
                            step="1000"
                        />
                        {/* Slider */}
                        <Form.Control
                            type="range"
                            min="0"
                            max="200000"
                            step="1000"
                            value={selectedMinSalary}
                            onChange={handleMinSalarySliderChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="salaryRange">
                        <Form.Label>Max Salary: €{selectedMaxSalary}</Form.Label>
                        {/* Number */}
                        <Form.Control
                            type="number"
                            value={selectedMaxSalary}
                            onChange={handleMaxSalaryChange}
                            min="0"
                            max="200000"
                            step="1000"
                        />
                        {/* Slider */}
                        <Form.Control
                            type="range"
                            min="0"
                            max="200000"
                            step="1000"
                            value={selectedMaxSalary}
                            onChange={handleMaxSalarySliderChange}
                        />

                    </Form.Group>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Close</Button>
                <Button variant="primary" onClick={handleApplyFilters}>Apply Filters</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SearchModal;
