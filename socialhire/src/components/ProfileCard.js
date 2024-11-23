import React, { useEffect, useState } from 'react';
import placeholderPic from '../images/placeholderPic.jpg';
import { useAuth } from '../hooks/useAuth';
import { useFirebaseDocument } from '../hooks/useFirebase';  // The hook for fetching document TODO change
import '../styles/ProfileCard.css';

const ProfileCard = () => {
    const { user } = useAuth();  // for safety
    const { getDocument, loading, error } = useFirebaseDocument('users');  // 'users' is your Firestore collection name
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Fetch the user's document using their uid
        const fetchUserData = async () => {
            if (user?.uid) {
                const data = await getDocument(user.uid);
                if (data) {
                    setUserData(data);
                }
            }
        };

        if (user?.uid) {
            fetchUserData();
        }
    }, [user, getDocument]);  // Re-run when user or getDocument changes

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="profile-card">
            <div className="header-profile-pic">
                <img
                    src={userData?.profilePicture || placeholderPic}  // Display profile picture if available
                    alt={`${userData?.firstName || 'User'}'s profile`}
                    className="profile-pic"
                />
            </div>
            <div className="header-profile-info">
                <h3 className="profile-name">
                    {userData?.firstName || 'Anonymous'} {userData?.lastName || 'User'}
                </h3>
                <p className="profile-profession">
                    {userData?.headline || 'Profession Not Set'}
                </p>
            </div>
        </div>
    );
};

export default ProfileCard;
