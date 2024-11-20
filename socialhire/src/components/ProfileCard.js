import React from 'react';
import placeholderPic from '../images/placeholderPic.jpg';
//import '../styles/ProfileCard.css';

const ProfileCard = () => {
    return (
        <div className="profile-card">
            <div className="header-profile-pic">
                <img
                    src={placeholderPic}
                    alt="Profile"
                    className="profile-pic"
                />
            </div>
            <div className="header-profile-info">
                <h3 className="profile-name">John Doe</h3>
                <p className="profile-profession">Software Engineer</p>
            </div>
        </div>
    );
};

export default ProfileCard;
