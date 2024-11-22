import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import placeholderPic from '../images/placeholderPic.jpg';
import '../styles/MainPage.css';
import ProfileCard from '../components/ProfileCard';
import PeopleToBefriend from '../components/AddPeople';
import {useAuth} from '../hooks/useAuth'; 

const Main = () => {
    const { user, loading } = useAuth();

    if (loading) {
        // Optionally, spinner or throbber
        return <div>Loading...</div>;
    }
    return (
        <Container fluid id="background" className="g-0">
            <div className="grid-layout">
                {/* Sidebar */}
                <div className="layout-sidebar">
                    <div className="sidebar-header">
                        <div className="header-top">
                            {/* <ProfileCard/> */}
                            {/* You can use ProfileCard here if needed */}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="layout-main">
                    <h1>Main Content</h1>
                    {/* Display the main content when the user is logged in */}
                </div>

                {/* Aside */}
                <div className="layout-aside">
                    <div className='add-people'>
                        <h2>Add people</h2>
                        <PeopleToBefriend/>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default Main;