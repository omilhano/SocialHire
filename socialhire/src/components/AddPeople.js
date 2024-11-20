import React, { useState, useEffect } from 'react';
import { db } from "../firebaseConfig"; // Ensure the path to firebaseConfig.js is correct
import { collection, getDocs } from "firebase/firestore";

const People = () => {
    const [users, setUsers] = useState([]); // State to store fetched users
    const [loading, setLoading] = useState(true); // State to handle loading status
    const [error, setError] = useState(null); // State to store error messages

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                console.log("Fetching users from Firestore...");
                const usersCollectionRef = collection(db, 'users'); // Reference to 'users' collection
                const snapshot = await getDocs(usersCollectionRef); // Get all documents in the collection

                console.log("Snapshot fetched:", snapshot.docs);

                // Map documents to array of user data
                const usersData = snapshot.docs.map((doc) => ({
                    id: doc.id, // Document ID
                    ...doc.data(), // Document fields
                }));

                console.log("Users data:", usersData);

                setUsers(usersData); // Update state with fetched data
            } catch (err) {
                console.error("Error fetching users:", err);
                setError("Failed to fetch users. Please try again later.");
            } finally {
                setLoading(false); // Set loading to false after fetch completes
            }
        };

        fetchUsers(); // Call the fetch function on component mount
    }, []); // Empty dependency array ensures the effect runs only once
    return (
        <div>
            <div>
                {users.length > 0 ? (
                    users.map((user) => (
                        <div key={user.id}>
                            <h3>{user.firstName} {user.lastName}</h3>
                            <p>{user.accountType}</p>
                        </div>
                    ))
                ) : (
                    <p>Loading users...</p>
                )}
            </div>
        </div>
    );
};

export default People;
