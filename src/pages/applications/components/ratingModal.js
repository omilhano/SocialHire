import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { doc, updateDoc, collection, addDoc, runTransaction } from 'firebase/firestore';
import { db } from 'firebaseConfig';

const RatingModal = ({ show, onClose, app }) => {
    const [rating, setRating] = useState('');
    const [feedback, setFeedback] = useState('');

    const handleRatingSubmit = async () => {
        if (!rating) {
            alert('Please provide a rating!');
            return;
        }

        const workerId = app.applicantId;
        const jobId = app.id;

        try {
            // Update the user's rating fields
            const userRef = doc(db, 'users', workerId);
            const ratingsRef = collection(db, 'users', workerId, 'ratings');

            await runTransaction(db, async (transaction) => {
                const userDoc = await transaction.get(userRef);

                if (!userDoc.exists()) {
                    throw new Error('User does not exist!');
                }

                const userData = userDoc.data();
                const currentAverage = userData.ratings?.average || 0;
                const currentCount = userData.ratings?.count || 0;

                const newCount = currentCount + 1;
                const newAverage = (currentAverage * currentCount + parseFloat(rating)) / newCount;

                transaction.update(userRef, {
                    'ratings.average': newAverage,
                    'ratings.count': newCount,
                });
            });

            // Add detailed rating
            await addDoc(ratingsRef, {
                jobId,
                rating: parseFloat(rating),
                feedback,
                timestamp: new Date().toISOString(),
            });

            // Update the application to Finished
            const applicationRef = doc(db, 'applications', jobId);
            await updateDoc(applicationRef, {
                status: 'Finished',
                rating: parseFloat(rating),
                feedback,
            });

            alert('Rating submitted successfully!');
            onClose();
            window.location.reload()
        } catch (error) {
            console.error('Error submitting rating:', error);
            alert('Failed to submit the rating.');
        }
        
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Rate the Worker</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Rating (1-5)</Form.Label>
                        <Form.Control
                            type="number"
                            min="1"
                            max="5"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Feedback</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleRatingSubmit}>
                    Submit
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RatingModal;
