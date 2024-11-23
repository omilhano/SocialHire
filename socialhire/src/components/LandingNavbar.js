import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import '../styles/LandingNavbar.css';

const LandingNavbar = () => {
    return (
        <Navbar style={{ backgroundColor: 'transparent' }} expand="lg" id="nav-bar">
            <Container fluid id='navbar' className="d-flex align-items-center justify-content-center">
                <Nav.Link as={Link} to="/">Landing Page</Nav.Link>
                <Nav.Link as={Link} to="/features">Features</Nav.Link>
                <Nav.Link as={Link} to="/signup">Join Now</Nav.Link>
                <Nav.Link as={Link} to="/signin">Log In</Nav.Link>
                <Nav.Link as={Link} to="/aboutus">About Us</Nav.Link>
            </Container>
        </Navbar>
    );
}

export default LandingNavbar;