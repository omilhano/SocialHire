import React, { useState, useEffect } from 'react';
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const People = () => {
    const [users, setUsers] = useState([]); // State to store fetched users
    const [loading, setLoading] = useState(true); // State to handle loading status
    const [error, setError] = useState(null); // State to store error messages

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                console.log("Fetching users from Firestore...");
                // console.log(auth.currentUser.uid)
                const auth = getAuth(); // Initialize auth
                const currentUserId = auth.currentUser?.uid; // Auth user's id to compare and prevent self from appearing
                console.log(currentUserId)
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
    return (
        <div className="add-people-space">
            {users.length > 0 ? (
                users.map((user) => (
                    <div id="people-item" key={user.id}>
                        <h3 id='people-name'>{user.firstName} {user.lastName}</h3>
                        <p id='people-details'>{user.headline ? user.headline : "Add for more details!"}
                        </p>
                        <div className='connect-box'>
                            <button id='connect-people'>+ Connect</button>
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
