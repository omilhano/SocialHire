import React from 'react';
import placeholderPic from '../images/placeholderPic.jpg';
import '../styles/ProfileCard.css';

const ProfileCard = ({ user }) => {
    return (
        <div className="profile-card">
            <div className="header-profile-pic">
                <img
                    src={user?.profilePicture || placeholderPic}
                    alt={`${user?.firstName || 'User'}'s profile`}
                    className="profile-pic"
                />
            </div>
            <div className="header-profile-info">
                <h3 className="profile-name">
                    {user?.firstName || 'First Name'} {user?.lastName || 'Last Name'}
                </h3>
                <p className="profile-profession">
                    {user?.headline || 'Profession Not Set'}
                </p>
            </div>
        </div>
    );
};

export default ProfileCard;
