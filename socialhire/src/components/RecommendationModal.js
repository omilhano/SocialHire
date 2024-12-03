// import React, { useState, useEffect } from 'react';
// import { Modal, Button } from 'react-bootstrap';
// import Dropdown from 'react-bootstrap/Dropdown';
// import '../styles/FiltersModal.css';
// import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase authentication
// import { db } from "../firebaseConfig"; // Import Firestore configuration
// import { collection, addDoc } from 'firebase/firestore';

// // Fetch friends from the user that is recommending
// // Fetch friends from database
// // Display them with a button below

// const RecommendModal = (show, onClose) => {
//     return (
//         <Modal show={show} onHide={onClose}>
//             <Modal.Header closeButton>
//                 <Modal.Title>Application</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <div>
//                     Hi
//                 </div>

//             </Modal.Body>
//             <Modal.Footer>
//                 <Button variant="secondary" onClick={onClose}>Close</Button>
//                 <Button variant="primary">Send Application</Button>
//             </Modal.Footer>
//         </Modal>

//     );
// };

// export default RecommendModal;