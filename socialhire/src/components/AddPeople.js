import React, { useState, useEffect } from 'react';
import { db } from "../firebaseConfig";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const People = () => {
    const [users, setUsers] = useState([]); // State to store fetched users
    const [loading, setLoading] = useState(true); // State to handle loading status
    const [error, setError] = useState(null); // State to store error messages
    const [pendingRequests, setPendingRequests] = useState({}); // Store pending requests for each user

    // TODO: SET_LIMIT number of users fetched

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true); // Set loading state
            try {
                console.log("Fetching non-friend users...");
                const auth = getAuth();
                const currentUserId = auth.currentUser?.uid;

                // If there is no user
                if (!currentUserId) {
                    console.error("No user is logged in.");
                    setError("User not logged in.");
                    return;
                }

                // Fetch all connections where currentUserId is involved
                const connectionsCollectionRef = collection(db, 'Connections');

                // Query for cases where currentUserId added someone
                const connectionsQuery1 = query(
                    connectionsCollectionRef,
                    where("user_id", "==", currentUserId), // Self user
                    where("status", "==", "friends") // Status of the connection is friends
                );

                // Query for cases where currentUserId was added by someone
                const connectionsQuery2 = query(
                    connectionsCollectionRef,
                    where("connected_user_id", "==", currentUserId),
                    where("status", "==", "friends")
                );

                // Execute both queries
                const [connectionsSnapshot1, connectionsSnapshot2] = await Promise.all([
                    getDocs(connectionsQuery1),
                    getDocs(connectionsQuery2),
                ]);


                // Extract connected user IDs from both queries
                const connectedUserIds = new Set([
                    ...connectionsSnapshot1.docs.map((doc) => doc.data().connected_user_id),
                    ...connectionsSnapshot2.docs.map((doc) => doc.data().user_id),
                ]);

                console.log("Connected User IDs:", connectedUserIds);

                // Query users excluding the current user and connected users
                const usersCollectionRef = collection(db, 'users');
                const usersQuery = query(usersCollectionRef); // Query all users initially
                const usersSnapshot = await getDocs(usersQuery);

                // Users fetched
                const allUsers = usersSnapshot.docs
                    .map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                    .filter(
                        (user) =>
                            user.id !== currentUserId && // Exclude the current user
                            !connectedUserIds.has(user.id) // Exclude already connected users
                    );

                // Shuffle the users for randomness
                const shuffledUsers = allUsers.sort(() => Math.random() - 0.5);

                setUsers(shuffledUsers); // Update state
            } catch (err) {
                console.error("Error fetching users:", err);
                setError("Failed to fetch users. Please try again later.");
            } finally {
                setLoading(false); // Reset loading state
            }
        };

        fetchUsers();
    }, []); // Runs only once



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
