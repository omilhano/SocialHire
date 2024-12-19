import React, { useState, useEffect } from 'react';
import { db } from "firebaseConfig";
import { collection, getDocs, query, where, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import './RequestNotification.css';

const ApplicationNotifications = () => {
    const [incomingRequests, setIncomingRequests] = useState([]); // State to store incoming applications
    const [loading, setLoading] = useState(true); // State to handle loading status
    const [error, setError] = useState(null); // State to store error messages

    useEffect(() => {
        const fetchIncomingRequests = async () => {
            try {
                const auth = getAuth(); // Initialize Firebase Auth
                const currentUserId = auth.currentUser?.uid; // Get the logged-in user's ID
                if (!currentUserId) {
                    console.error("No user is logged in.");
                    return;
                }

                console.log("Fetching incoming requests for user:", currentUserId);
                const applicationsCollectionRef = collection(db, 'applications'); // Reference to 'applications' collection
                const q = query(
                    applicationsCollectionRef,
                    where("creatorId", "==", currentUserId), // Filter by currentUserId (jobs created by the user)
                    where("status", "==", "pending") // Only fetch applications with 'pending' status
                );

                const snapshot = await getDocs(q); // Fetch applications from Firestore
                const requestsData = await Promise.all(
                    snapshot.docs.map(async (docSnap) => {
                        const data = docSnap.data(); // Get application data
                        const userRef = doc(db, 'users', data.applicantId); // Reference to 'users' collection for the applicant
                        const userSnapshot = await getDoc(userRef); // Fetch applicant's user data

                        const userData = userSnapshot.data(); // Extract user details
                        return {
                            id: docSnap.id,
                            userName: `${userData.firstName} ${userData.lastName}`, // Combine first and last name
                            ...data,
                        };
                    })
                );

                console.log("Fetched applications data:", requestsData);
                setIncomingRequests(requestsData); // Update state with applications
            } catch (err) {
                console.error("Error fetching incoming applications:", err);
                setError("Failed to fetch incoming applications. Please try again later.");
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchIncomingRequests(); // Fetch incoming applications when the component mounts
    }, []); // Empty dependency array ensures the effect runs only once

    const handleRequestResponse = async (requestId, accept) => {
        const applicationRef = doc(db, 'applications', requestId); // Reference to specific application document

        try {
            // Update the status of the application based on acceptance
            await updateDoc(applicationRef, {
                status: accept ? "accepted" : "rejected", // Update to 'accepted' or 'rejected'
            });

            console.log(`Application ${accept ? "accepted" : "rejected"}`);
            setIncomingRequests((prevState) => prevState.filter((req) => req.id !== requestId)); // Remove the processed request from the state
        } catch (err) {
            console.error("Error responding to application:", err);
        }
    };

    return (
        <div className="request-notifications">
            {loading ? (
                <p>Loading incoming applications...</p>
            ) : error ? (
                <p>{error}</p>
            ) : incomingRequests.length > 0 ? (
                incomingRequests.map((request) => (
                    <div key={request.id} className="request-item">
                        <p className='notification-text-p'>
                            {request.userName} applied for your job posting:
                        </p>
                        <div className="request-actions">
                            <button>See more</button>
                        </div>
                        <hr />
                    </div>
                ))
            ) : (
                <p>No incoming applications.</p>
            )}
        </div>
    );
};

export default ApplicationNotifications;
