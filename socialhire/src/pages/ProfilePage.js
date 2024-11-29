import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // To get the :username from the URL
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
//import '../styles/ProfilePage.css';

const ProfilePage = () => {
    const { username } = useParams(); // Get the username from the URL
    const [profileData, setProfileData] = useState(null); // State for profile data
    const [loading, setLoading] = useState(true); // State for loading
    const [error, setError] = useState(null); // State for error messages

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Query Firestore for the user with the specific username
                const userQuery = query(
                    collection(db, "users"),
                    where("username", "==", username)
                );
                const querySnapshot = await getDocs(userQuery);

                if (!querySnapshot.empty) {
                    // Assuming usernames are unique, so we take the first result
                    setProfileData(querySnapshot.docs[0].data());
                } else {
                    throw new Error("User not found");
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError(err.message);
            } finally {
                setLoading(false); // Stop loading regardless of the result
            }
        };

        fetchProfile();
    }, [username]); // Re-fetch data if the username changes

    if (loading) {
        return <div className="profile-loading">Loading...</div>;
    }

    if (error) {
        return <div className="profile-error">Error: {error}</div>;
    }

    if (!profileData) {
        return <div className="profile-error">Profile not found</div>;
    }

    // Render the profile data
    return (
        <div className="profile-page">
            <h1>{profileData.firstName} {profileData.lastName}'s Profile</h1>
            <p><strong>Email:</strong> {profileData.email}</p>
            <p><strong>Account Type:</strong> {profileData.accountType}</p>
            <p><strong>Joined On:</strong> {new Date(profileData.createdAt).toLocaleDateString()}</p>
        </div>
    );
};

export default ProfilePage;
