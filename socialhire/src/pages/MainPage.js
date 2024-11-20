import React from 'react';
import { Container } from 'react-bootstrap';
import placeholderPic from '../images/placeholderPic.jpg';
import '../styles/MainPage.css';
import ProfileCard from '../components/ProfileCard';

const Main = () => {
    return (
        <Container fluid id="background" className="g-0">
            <div className="grid-layout">
                {/* Sidebar */}
                <div className="layout-sidebar">
                    <div className="sidebar-header">
                        <div className="header-top">
                        <ProfileCard />
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
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default Main;
