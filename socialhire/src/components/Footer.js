// Importing necessary libraries
import React from 'react'; // Core React library for building components
import Container from 'react-bootstrap/Container'; // Bootstrap's responsive container for layout management

// Functional component for rendering the footer
const Footer = () => {
  return (
    // Footer element with padding and background color
    <footer className="py-3" style={{ backgroundColor: "#E2E2E2" }}> 
      {/* Using Bootstrap's Container for layout, centering elements */}
      <Container className="d-flex flex-column align-items-center"> 
        {/* Footer trademark text */}
        <p id="trademarker-E5E5" style={{ color: "black", fontSize: "1.6em", fontWeight: "bold" }}>
          © {new Date().getFullYear()} SocialHire. All rights reserved. 
          {/* Dynamically displays the current year using JavaScript's Date object */}
        </p>
        {/* Unordered list of footer links, styled as inline */}
        <ul className="list-inline">
          {/* Privacy Policy link */}
          <li className="list-inline-item mx-3">
            <a href="/PrivacyPolicy" style={{ color: "black", fontSize: "1.2em", textDecoration: "none" }}>
              Privacy Policy
            </a>
          </li>
          {/* Terms of Service link */}
          <li className="list-inline-item mx-3">
            <a href="/TOS" style={{ color: "black", fontSize: "1.2em", textDecoration: "none" }}>
              Terms of Service
            </a>
          </li>
          {/* Contact Us link */}
          <li className="list-inline-item mx-3">
            <a href="/Contacts" style={{ color: "black", fontSize: "1.2em", textDecoration: "none" }}>
              Contact Us
            </a>
          </li>
          {/* Credits link */}
          <li className="list-inline-item mx-3">
            <a href="/Credits" style={{ color: "black", fontSize: "1.2em", textDecoration: "none" }}>
              Credits
            </a>
          </li>
        </ul>
      </Container>
    </footer>
  );
};

// Exporting the Footer component for use in other parts of the application
export default Footer;
