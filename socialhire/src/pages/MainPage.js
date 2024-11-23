import React from 'react';
import { Container, Spinner } from 'react-bootstrap';
import '../styles/MainPage.css';
import ProfileCard from '../components/ProfileCard';
import PeopleToBefriend from '../components/AddPeople';
import { useAuth } from '../hooks/useAuth';
// import { auth } from "../firebaseConfig";

const Main = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-container">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (!loading && !user) {
        return <div>Redirecting...</div>; // Should never really be hit due to useAuth's redirect
    }
    // console.log(auth.currentUser.uid)
    return (
        <Container fluid id="background" className="g-0">
            <div className="grid-layout">
                {/* Sidebar */}
                <div className="layout-sidebar">
                    <div className="sidebar-header">
                        <div className="header-top">
                            <ProfileCard user={user} />
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="layout-main">
                    <h1>Main Content</h1>
                </div>

                {/* Aside */}
                <div className="layout-aside">
                    <div className="add-people">
                        <h2>Add People</h2>
                        <PeopleToBefriend />
                    </div>
                </div>
            </div>
            
        </Container>
    );
};

export default Main;
