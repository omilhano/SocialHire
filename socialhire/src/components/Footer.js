import React from 'react';

const Footer = () => {
  return (
    <footer className="py-2" style={{ backgroundColor: "#17497B" }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column' }}>
        <p id='trademarker-E5E5'  style={{color:"#E5E5E5"}}>© {new Date().getFullYear()} SocialHire. All rights reserved.</p>
        <ul className="list-inline">
          <li className="list-inline-item"><a href="#" style={{ color: "#E5E5E5" }}>Privacy Policy</a></li>
          <li className="list-inline-item"><a href="#" style={{ color: "#E5E5E5" }}>Terms of Service</a></li>
          <li className="list-inline-item"><a href="#" style={{ color: "#E5E5E5" }}>Contact Us</a></li>
          <li className="list-inline-item"><a href='#' style={{color:"#E5E5E5"}}>Credits</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
