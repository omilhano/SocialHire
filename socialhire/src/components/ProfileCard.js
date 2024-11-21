import React from 'react';
import { useNavigate } from 'react-router-dom';
import placeholderPic from '../images/placeholderPic.jpg';
import useAuthRedirect from '../hooks/useAuthRedirect';
import '../styles/ProfileCard.css';

const ProfileCard = () => {
    const { currentUser, loading, error } = useAuthRedirect();

    // Render profile card with user data
    return (
        <div className="profile-card">
            <div className="header-profile-pic">
                <img
                    src={currentUser?.profilePicture || placeholderPic} // Replace with actual profile picture field if available
                    alt="Profile"
                    className="profile-pic"
                />
            </div>
            <div className="header-profile-info">
                <h3 className="profile-name">
                    {currentUser?.firstName} {currentUser?.lastName}
                </h3>
                <p className="profile-profession">{currentUser?.headline || 'Profession Not Set'}</p>
            </div>
        </div>
    );
};

export default ProfileCard;
