import React from 'react';
import Container from 'react-bootstrap/Container';

const Footer = () => {
  return (
    <footer className="py-3" style={{ backgroundColor: "#17497B" }}>
      <Container className="d-flex flex-column align-items-center">
        <p id="trademarker-E5E5" style={{ color: "#E5E5E5", fontSize: "1.6em" }}>
          © {new Date().getFullYear()} SocialHire. All rights reserved.
        </p>
        <ul className="list-inline">
          <li className="list-inline-item">
            <a href="#" style={{ color: "#E5E5E5", fontSize: "1.2em", textDecoration: "none" }}>Privacy Policy</a>
          </li>
          <li className="list-inline-item">
            <a href="#" style={{ color: "#E5E5E5", fontSize: "1.2em", textDecoration: "none" }}>Terms of Service</a>
          </li>
          <li className="list-inline-item">
            <a href="#" style={{ color: "#E5E5E5", fontSize: "1.2em", textDecoration: "none" }}>Contact Us</a>
          </li>
          <li className="list-inline-item">
            <a href="#" style={{ color: "#E5E5E5", fontSize: "1.2em", textDecoration: "none" }}>Credits</a>
          </li>
        </ul>
      </Container>
    </footer>
  );
};

export default Footer;

