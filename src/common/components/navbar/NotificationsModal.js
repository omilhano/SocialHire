import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import './SearchModal.css';
import RequestNotification from './RequestNotification';
import ApplicationNotifications from './ApplicationsNotifications';

const NotificationModal = ({ show, onClose }) => {
    // State to hold selected values for each dropdown
    const [jobType, setJobType] = useState('Choose Type of Job');
    const [location, setLocation] = useState('Choose Location');
    const [numOfPeople, setNumOfPeople] = useState('Choose Nº of people');

    // Reset the state when the modal is closed
    useEffect(() => {
        if (!show) {
            setJobType('Choose Type of Job');
            setLocation('Choose Location');
            setNumOfPeople('Choose Nº of people');
        }
    }, [show]); // Only run when 'show' changes

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Notications</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Friend Notifications:</h4>
                <RequestNotification />
                <br></br>
                <h4>Job notifications:</h4>
                <ApplicationNotifications/>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close menu
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default NotificationModal;
