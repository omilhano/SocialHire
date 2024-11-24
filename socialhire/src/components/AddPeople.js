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

                if (!currentUserId) {
                    console.error("No user is logged in.");
                    return;
                }

                console.log("Current User ID:", currentUserId);

                const usersCollectionRef = collection(db, 'users'); // Reference to 'users' collection
                const connectionsCollectionRef = collection(db, 'Connections'); // Reference to 'connections' collection

                // Fetch all users
                const usersSnapshot = await getDocs(usersCollectionRef);

                console.log("Users snapshot fetched:", usersSnapshot.docs);

                // Map users to array of user data
                let allUsers = usersSnapshot.docs.map((doc) => ({
                    id: doc.id, // Document ID
                    ...doc.data(), // Document fields
                }));

                // Fetch all connections where currentUserId is involved and status is "accepted"
                const connectionsQuery = query(
                    connectionsCollectionRef,
                    where("user_id", "==", currentUserId) // Current user initiated the connection
                );

                const connectionsSnapshot = await getDocs(connectionsQuery);

                console.log("Connections snapshot fetched:", connectionsSnapshot.docs);

                // Get a set of IDs of users with "friends" status
                const acceptedUserIds = new Set(
                    connectionsSnapshot.docs
                        .filter((doc) => doc.data().status === "friends")
                        .map((doc) => doc.data().connected_user_id)
                );

                console.log("Friends User IDs:", acceptedUserIds);

                // Filter out the authenticated user and users with "friends" connections
                allUsers = allUsers.filter(
                    (user) => user.id !== currentUserId && !acceptedUserIds.has(user.id)
                );

                // Shuffle the array randomly
                allUsers = allUsers.sort(() => Math.random() - 0.5);

                console.log("Filtered and randomized users data:", allUsers);

                setUsers(allUsers); // Update state with filtered data
            } catch (err) {
                console.error("Error fetching users:", err);
                setError("Failed to fetch users. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
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
                users.slice(0, 4).map((user) => ( // Limit to first 4 users
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
