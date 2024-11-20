import React from 'react';
import { Container } from 'react-bootstrap';
import placeholderPic from '../images/placeholderPic.jpg';
import '../styles/MainPage.css';
import ProfileCard from '../components/ProfileCard';
import PeopleToBefriend from '../components/AddPeople';

const Main = () => {
    return (
        <Container fluid id="background" className="g-0">
            <div className="grid-layout">
                {/* Sidebar */}
                <div className="layout-sidebar">
                    <div className="sidebar-header">
                        <div className="header-top">
                        <ProfileCard />
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="layout-main">
                    <h1>Main Content</h1>
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
