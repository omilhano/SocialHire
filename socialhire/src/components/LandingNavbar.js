import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import '../styles/LandingNavbar.css';

const LandingNavbar = () => {
    return (
        <Navbar style={{ backgroundColor: 'transparent' }} expand="lg" id="nav-bar">
            <Container fluid id='navbar' className="d-flex align-items-center justify-content-center">
                <Nav.Link href="Features">Features</Nav.Link>
                <Nav.Link href="SignUp">Join Now</Nav.Link>
                <Nav.Link href="SignIn">Log In</Nav.Link>
                <Nav.Link href="AboutUs">About Us</Nav.Link>
            </Container>
        </Navbar>
    );
}

export default LandingNavbar;