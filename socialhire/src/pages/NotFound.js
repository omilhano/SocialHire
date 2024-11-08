// src/pages/NotFound.js
import React from 'react';
import '../styles/NotFound.css';

function NotFound() {
  return (
    <div className="notfoundcontainer" style={{"height":"500px"}}>
      <h1 style={{"fontSize":"2em !important"}} id='notfoundtitle'>404 - Page Not Found</h1>
      <p id='notfountext'>Sorry, the page you are looking for does not exist.</p>
      <a href="/" className="backhomelink" id='goback'>Go back to Home</a>
    </div>
  );
}

export default NotFound;
