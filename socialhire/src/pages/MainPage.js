// Importing necessary libraries, components, and custom hooks
import React from 'react'; // React library for building components
import { Container, Spinner } from 'react-bootstrap'; // Bootstrap Container and Spinner for layout and loading indicator
import '../styles/MainPage.css'; // Custom CSS for the Main page
import ProfileCard from '../components/ProfileCard'; // Component for displaying the user's profile information
import PeopleToBefriend from '../components/AddPeople'; // Component for displaying suggestions to connect with people
import { useAuth } from '../hooks/useAuth'; // Custom hook to handle user authentication state

const Main = () => {
    const { user, loading } = useAuth(); // Destructuring user and loading state from the authentication hook

    // Display a loading spinner while authentication status is being determined
    if (loading) {
        return (
            <div className="loading-container">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span> {/* Accessibility for screen readers */}
                </Spinner>
            </div>
        );
    }

    // Handle the case where no user is authenticated (edge case since useAuth might handle redirection)
    if (!loading && !user) {
        return <div>Redirecting...</div>; // Placeholder for a redirect scenario
    }

    // Main page layout once the user is authenticated
    return (
        <Container fluid id="background" className="g-0">
            <div className="grid-layout">
                {/* Sidebar */}
                <div className="layout-sidebar">
                    <div className="sidebar-header">
                        <div className="header-top">
                            {/* ProfileCard displays user information */}
                            <ProfileCard user={user} />
                        </div>
                    </div>
                </div>

                {/* Main Content Section */}
                <div className="layout-main">
                    <h1>Main Content</h1>
                    {/* Placeholder for the main content area */}
                </div>

                {/* Aside Section */}
                <div className="layout-aside">
                    <div className="add-people">
                        <h2>Add People</h2>
                        {/* Component to suggest people the user might want to connect with */}
                        <PeopleToBefriend />
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default Main;
