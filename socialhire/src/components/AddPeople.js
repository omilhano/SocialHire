import React, { useState, useEffect } from 'react';
import { db } from "../firebaseConfig";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const People = () => {
    const [users, setUsers] = useState([]); // State to store fetched users
    const [loading, setLoading] = useState(true); // State to handle loading status
    const [error, setError] = useState(null); // State to store error messages
    const [pendingRequests, setPendingRequests] = useState({}); // Store pending requests for each user

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                console.log("Fetching users from Firestore...");
                const auth = getAuth(); // Initialize auth
                const currentUserId = auth.currentUser?.uid; // Auth user's id to compare and prevent self from appearing
                console.log(currentUserId);
                const usersCollectionRef = collection(db, 'users'); // Reference to 'users' collection
                const snapshot = await getDocs(usersCollectionRef); // Get all documents in the collection

                console.log("Snapshot fetched:", snapshot.docs); // Debug

                // Map documents to array of user data and exclude the authenticated user
                const usersData = snapshot.docs
                    .map((doc) => ({
                        id: doc.id, // Document ID
                        ...doc.data(), // Document fields
                    }))
                    .filter((user) => user.id !== currentUserId);

                console.log("Users data:", usersData);

                setUsers(usersData); // Update state with fetched data
            } catch (err) {
                console.error("Error fetching users:", err);
                setError("Failed to fetch users. Please try again later.");
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchUsers(); // Call the fetch function on component mount
    }, []); // Empty dependency array ensures the effect runs only once

    const addfriend = async (connectedUserId) => {
        const auth = getAuth();
        const currentUserId = auth.currentUser?.uid; // Get the logged-in user's ID

        if (!currentUserId) {
            console.error("No user is logged in.");
            return;
        }

        try {
            // Query to check if there's already a pending request between the users
            const connectionsCollectionRef = collection(db, 'Connections');
            const q = query(
                connectionsCollectionRef,
                where("user_id", "in", [currentUserId, connectedUserId]),
                where("connected_user_id", "in", [currentUserId, connectedUserId]),
                where("status", "==", "pending")
            );

            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                console.log("Connection request already exists.");
                // Update pendingRequest state for this user
                setPendingRequests((prevState) => ({
                    ...prevState,
                    [connectedUserId]: true, // Set this user's pending request to true
                }));
                return;
            }

            // If no pending request exists, proceed with adding the new request
            const newConnection = {
                user_id: currentUserId, // The logged-in user
                connected_user_id: connectedUserId, // The user being added
                status: 'pending',
                created_at: new Date()
            };

            // Add the new connection to the Firestore collection
            await addDoc(connectionsCollectionRef, newConnection);

            console.log("Connection request sent successfully");

            // Update pendingRequest state to reflect the new pending request
            setPendingRequests((prevState) => ({
                ...prevState,
                [connectedUserId]: true,
            }));
        } catch (err) {
            console.error("Error adding friend:", err);
        }
    };

    return (
        <div className="add-people-space">
            {users.length > 0 ? (
                users.map((user) => (
                    <div id="people-item" key={user.id}>
                        <h2 id='people-name'>{user.firstName} {user.lastName}</h2>
                        <p id='people-details'>{user.headline ? user.headline : "Add for more details!"}</p>
                        <div className='connect-box'>
                            <button
                                id='connect-people'
                                onClick={() => addfriend(user.id)}
                            >
                                {pendingRequests[user.id] ? "Request Pending" : "+ Connect"}
                            </button>
                        </div>
                        <hr></hr>
                    </div>
                ))
            ) : (
                <p>Loading users...</p>
            )}
        </div>
    );
};

export default People;
