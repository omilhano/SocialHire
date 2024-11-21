import React from 'react';
import { useNavigate } from 'react-router-dom';
import useCurrentUser from '../hooks/useCurrentUser';
import placeholderPic from '../images/placeholderPic.jpg';
import '../styles/ProfileCard.css';

const ProfileCard = () => {
    const { currentUser, loading, error } = useCurrentUser();
    const navigate = useNavigate();

    // Redirect to login if there's an error or no user is logged in - does this make sense
    React.useEffect(() => {
        if (error || (!loading && !currentUser)) {
            navigate('/signin');
        }
    }, [error, currentUser, loading, navigate]);

    if (loading) {
        return <p>Loading...</p>;
    }

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
