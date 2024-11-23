// Importing necessary libraries and assets
import React, { useEffect, useState } from 'react'; // React core library, useEffect for side-effects, useState for state management
import placeholderPic from '../images/placeholderPic.jpg'; // Placeholder image to show when a user doesn't have a profile picture
import { useAuth } from '../hooks/useAuth'; // Custom hook for authentication, likely providing the current user context
import { useFirebaseDocument } from '../hooks/useFirebase'; // Custom hook for interacting with a Firestore collection (e.g., retrieving user documents)
import '../styles/ProfileCard.css'; // CSS file for styling the ProfileCard component

// Functional component to display user profile information
const ProfileCard = () => {
    const { user } = useAuth(); // Destructures 'user' from the authentication context
    const { getDocument, loading, error } = useFirebaseDocument('users'); 
    // `getDocument`: function to fetch user data based on UID
    // `loading` and `error`: state indicators for async data fetching

    const [userData, setUserData] = useState(null); // Local state to store the user's profile data

    // Effect to fetch user data whenever the `user` object or `getDocument` changes
    useEffect(() => {
        // Async function to fetch the user's profile data from Firestore
        const fetchUserData = async () => {
            if (user?.uid) { // Ensure the user object and UID exist
                const data = await getDocument(user.uid); // Retrieve document by UID
                if (data) {
                    setUserData(data); // Update state with retrieved data
                }
            }
        };

        if (user?.uid) { // Avoid unnecessary API calls if user or UID is not available
            fetchUserData();
        }
    }, [user, getDocument]); // Dependencies array: Effect re-runs when `user` or `getDocument` changes

    // Conditional rendering: Display a loading spinner/message when data is being fetched
    if (loading) {
        return <div>Loading...</div>;
    }

    // Conditional rendering: Display an error message if there's a problem with data fetching
    if (error) {
        return <div>Error: {error}</div>;
    }

    // Main UI for the profile card
    return (
        <div className="profile-card"> {/* Root container for the profile card */}
            <div className="header-profile-pic"> {/* Section for the user's profile picture */}
                <img
                    src={userData?.profilePicture || placeholderPic} // Show user's profile picture if available, otherwise display the placeholder
                    alt={`${userData?.firstName || 'User'}'s profile`} // Accessible alt text fallback for screen readers
                    className="profile-pic" // CSS class for styling the profile picture
                />
            </div>
            <div className="header-profile-info"> {/* Section for displaying user information */}
                <h3 className="profile-name">
                    {userData?.firstName || 'Anonymous'} {userData?.lastName || 'User'} 
                    {/* Default to 'Anonymous User' if no name is available, this should not appear */}
                </h3>
                <p className="profile-profession">
                    {userData?.headline || 'Profession Not Set'} 
                    {/* Default to 'Profession Not Set' if no headline is provided, this should not appear*/}
                </p>
            </div>
        </div>
    );
};

// Exporting the component to make it available for use in other parts of the application
export default ProfileCard;
