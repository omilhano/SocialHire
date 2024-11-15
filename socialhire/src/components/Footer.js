import React from 'react';
import Container from 'react-bootstrap/Container';

const Footer = () => {
  return (
    <footer className="py-3" style={{ backgroundColor: "#E2E2E2" }}>
      <Container className="d-flex flex-column align-items-center">
        <p id="trademarker-E5E5" style={{ color: "black", fontSize: "1.6em" }}>
          © {new Date().getFullYear()} SocialHire. All rights reserved.
        </p>
        <ul className="list-inline">
          <li className="list-inline-item mx-3">
            <a href="/PrivacyPolicy" style={{ color: "black", fontSize: "1.2em", textDecoration: "none" }}>
              Privacy Policy
            </a>
          </li>
          <li className="list-inline-item mx-3">
            <a href="/TOS" style={{ color: "black", fontSize: "1.2em", textDecoration: "none" }}>
              Terms of Service
            </a>
          </li>
          <li className="list-inline-item mx-3">
            <a href="/Contacts" style={{ color: "black", fontSize: "1.2em", textDecoration: "none" }}>
              Contact Us
            </a>
          </li>
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

export default Footer;
