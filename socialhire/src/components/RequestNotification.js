import React, { useState, useEffect } from 'react';
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const RequestNotification = () => {
    const [incomingRequests, setIncomingRequests] = useState([]); // State to store incoming requests
    const [loading, setLoading] = useState(true); // State to handle loading status
    const [error, setError] = useState(null); // State to store error messages

    useEffect(() => {
        const fetchIncomingRequests = async () => {
            try {
                const auth = getAuth(); // Initialize auth
                const currentUserId = auth.currentUser?.uid; // Get the logged-in user's ID
                if (!currentUserId) {
                    console.error("No user is logged in.");
                    return;
                }

                console.log("Fetching incoming requests for user:", currentUserId);
                const connectionsCollectionRef = collection(db, 'Connections'); // Reference to 'Connections' collection
                const q = query(
                    connectionsCollectionRef,
                    where("connected_user_id", "==", currentUserId), // Filter by connected_user_id
                    where("status", "==", "pending") // Filter by pending status
                );

                const snapshot = await getDocs(q); // Get the pending requests directed to the user
                const requestsData = await Promise.all(
                    snapshot.docs.map(async (docSnap) => {
                        const data = docSnap.data();
                        const userRef = doc(db, 'users', data.user_id); // Reference to the 'users' collection for the user who sent the request
                        const userSnapshot = await getDoc(userRef); // Fetch the user data

                        const userData = userSnapshot.data(); // Extract user data
                        return {
                            id: docSnap.id,
                            userName: `${userData.firstName} ${userData.lastName}`, // Combine first and last name
                            ...data,
                        };
                    })
                );

                console.log("Incoming requests data:", requestsData);
                setIncomingRequests(requestsData); // Update state with incoming requests
            } catch (err) {
                console.error("Error fetching incoming requests:", err);
                setError("Failed to fetch incoming requests. Please try again later.");
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchIncomingRequests(); // Fetch incoming requests when the component mounts
    }, []); // Empty dependency array ensures the effect runs only once

    const handleRequestResponse = async (requestId, accept) => {
        const connectionsCollectionRef = collection(db, 'Connections');
        const requestRef = doc(connectionsCollectionRef, requestId);

        try {
            // Update the status of the connection request based on acceptance
            await updateDoc(requestRef, {
                status: accept ? "friends" : "rejected",
            });

            console.log(`Request ${accept ? "accepted" : "rejected"}`);
            setIncomingRequests((prevState) => prevState.filter((req) => req.id !== requestId));
        } catch (err) {
            console.error("Error responding to request:", err);
        }
    };

    return (
        <div className="request-notifications">
            {loading ? (
                <p>Loading incoming requests...</p>
            ) : error ? (
                <p>{error}</p>
            ) : incomingRequests.length > 0 ? (
                incomingRequests.map((request) => (
                    <div key={request.id} className="request-item">
                        <p>{request.userName} wants to connect with you</p> {/* Displaying user name */}
                        <div className="request-actions">
                            <button
                                className="accept-btn"
                                onClick={() => handleRequestResponse(request.id, true)}
                            >
                                Accept
                            </button>
                            <button
                                className="reject-btn"
                                onClick={() => handleRequestResponse(request.id, false)}
                            >
                                Reject
                            </button>
                        </div>
                        <hr />
                    </div>
                ))
            ) : (
                <p>No incoming requests.</p>
            )}
        </div>
    );
};

export default RequestNotification;
