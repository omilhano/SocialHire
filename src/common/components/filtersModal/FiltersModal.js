import React, { useState, useEffect } from 'react';
import { Modal, Button, Dropdown, Form } from 'react-bootstrap';
import './FiltersModal.css';

// Change render according to job type
// Hustling doesnt have pay range just price/hour

// Pass on filters for parent component
const SearchModal = ({ show, onClose, filters, setFilters }) => {
    // Destructure filters for easier access and set defaults if not provided
    const { jobType, location, minSalary, maxSalary, pricePerHour, userType } = filters || {};

    // Local state for each filter category
    const [selectedJobType, setSelectedJobType] = useState(jobType || 'Choose Type of Job');
    const [selectedLocation, setSelectedLocation] = useState(location || 'Choose Location');
    const [selectedMinSalary, setSelectedMinSalary] = useState(minSalary || 0);
    const [selectedMaxSalary, setSelectedMaxSalary] = useState(maxSalary || 200000);
    const [selectedPricePerHour, setSelectedPricePerHour] = useState(pricePerHour || 0);
    const [selectedUserType, setSelectedUserType] = useState(userType || 'Choose User Type'); // User Type state

    // Reset local state when modal is closed
    useEffect(() => {
        if (!show) {
            setSelectedJobType(jobType || 'Choose Type of Job');
            setSelectedLocation(location || 'Choose Location');
            setSelectedMinSalary(minSalary || 0);
            setSelectedMaxSalary(maxSalary || 200000);
            setSelectedPricePerHour(pricePerHour || 0);
            setSelectedUserType(userType || 'Choose User Type'); // Reset User Type
        }
    }, [show, jobType, location, minSalary, maxSalary, pricePerHour, userType]);

    // Mapping dropdown values to related Firestore values
    const jobTypeMapping = {
        'Formal': 'Formal Job',
        'Hustler': 'Hustler'
    };

    const locationMapping = {
        'Lisbon Area': 'Lisbon',
        'Porto Area': 'Porto',
        'Algarve Area': 'Algarve'
    };

    const userTypeMapping = {
        'User': 'user',
        'Company': 'company'
    };

    // Handlers for each dropdown
    const handleJobTypeSelect = (value) => setSelectedJobType(value);
    const handleLocationSelect = (value) => setSelectedLocation(value);
    const handleUserTypeSelect = (value) => setSelectedUserType(value); // Handle User Type change

    // Handlers for salary and price per hour
    const handleMinSalaryChange = (e) => setSelectedMinSalary(e.target.value);
    const handleMaxSalaryChange = (e) => setSelectedMaxSalary(e.target.value);
    const handlePricePerHourChange = (e) => setSelectedPricePerHour(e.target.value);

    // Apply filters when the button is clicked
    const handleApplyFilters = () => {
        const appliedFilters = {};

        // Only add filters that are selected (not the default)
        if (selectedJobType !== 'Choose Type of Job') {
            appliedFilters.jobType = jobTypeMapping[selectedJobType] || selectedJobType;
        }
        if (selectedLocation !== 'Choose Location') {
            appliedFilters.location = locationMapping[selectedLocation] || selectedLocation;
        }

        // Handle salary or price per hour based on job type
        if (selectedJobType === 'Hustler') {
            if (selectedPricePerHour > 0) {
                appliedFilters.pricePerHour = selectedPricePerHour;
            }
        } else {
            if (selectedMinSalary > 0) {
                appliedFilters.minSalary = selectedMinSalary;
            }
            if (selectedMaxSalary < 200000) {
                appliedFilters.maxSalary = selectedMaxSalary;
            }
        }

        // Include user type filter
        if (selectedUserType !== 'Choose User Type') {
            appliedFilters.userType = userTypeMapping[selectedUserType] || selectedUserType;
        }

        setFilters(appliedFilters); // Pass the filters to the parent
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

                {/* User Type Dropdown */}
                <Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown-userType">
                        {selectedUserType}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleUserTypeSelect('User')}>User</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleUserTypeSelect('Company')}>Company</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                {/* Conditional Rendering for Salary/Price Based on Job Type */}
                {selectedJobType === 'Hustler' ? (
                    <div className="price-per-hour">
                        <h6>Price per Hour</h6>
                        <Form.Group controlId="pricePerHour">
                            <Form.Label>Price: €{selectedPricePerHour}</Form.Label>
                            <Form.Control
                                type="number"
                                value={selectedPricePerHour}
                                onChange={handlePricePerHourChange}
                                min="0"
                                step="10"
                            />
                        </Form.Group>
                    </div>
                ) : (
                    <div className="salary-range">
                        <h6>Salary Range</h6>
                        <Form.Group controlId="salaryRange">
                            <Form.Label>Min Salary: €{selectedMinSalary}</Form.Label>
                            <Form.Control
                                type="number"
                                value={selectedMinSalary}
                                onChange={handleMinSalaryChange}
                                min="0"
                                max="200000"
                                step="1000"
                            />
                        </Form.Group>

                        <Form.Group controlId="salaryRange">
                            <Form.Label>Max Salary: €{selectedMaxSalary}</Form.Label>
                            <Form.Control
                                type="number"
                                value={selectedMaxSalary}
                                onChange={handleMaxSalaryChange}
                                min="0"
                                max="200000"
                                step="1000"
                            />
                        </Form.Group>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Close</Button>
                <Button variant="primary" onClick={handleApplyFilters}>Apply Filters</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SearchModal;
