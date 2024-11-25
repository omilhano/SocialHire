// Importing necessary libraries and components
import React from 'react'; // Core React library for building components
import Container from 'react-bootstrap/Container'; // Bootstrap container for responsive layout
import Navbar from 'react-bootstrap/Navbar'; // Bootstrap navbar component for navigation
import Nav from 'react-bootstrap/Nav'; // Bootstrap navigation wrapper for navbar links
import { Link } from 'react-router-dom'; // React Router's `Link` for client-side routing
import '../styles/LandingNavbar.css'; // Custom CSS file for additional styling of the navbar

// Functional component for rendering the landing page navigation bar
const LandingNavbar = () => {
    return (
        // Navbar component with transparent background and Bootstrap styling
        <Navbar style={{ backgroundColor: 'transparent' }} expand="lg" id="nav-bar">
            {/* Container for alignment and spacing, set to be fluid (spanning full width) */}
            <Container fluid id="navbar" className="d-flex align-items-center justify-content-center">
                {/* Navigation links for routing to various sections of the site */}
                <Nav.Link as={Link} to="/">Landing Page</Nav.Link> 
                {/* Link to the landing page */}
                <Nav.Link as={Link} to="/features">Features</Nav.Link> 
                {/* Link to the features page */}
                <Nav.Link as={Link} to="/signup">Join Now</Nav.Link> 
                {/* Link to the sign-up page */}
                <Nav.Link as={Link} to="/signin">Log In</Nav.Link> 
                {/* Link to the log-in page */}
                <Nav.Link as={Link} to="/aboutus">About Us</Nav.Link> 
                {/* Link to the About Us page */}
            </Container>
        </Navbar>
    );
};

// Exporting the LandingNavbar component for use in other parts of the application
export default LandingNavbar;
