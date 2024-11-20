import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db, storage } from "../firebaseConfig";
import { doc, getDoc, updateDoc, collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import '../styles/Navbar.css';
import SearchModal from './FiltersModal';
import brandLogo from '../images/brandlogo.png';
import lookGlass from '../images/lookglass.png';
import placeholderPic from '../images/placeholderPic.jpg';
import HambMenu from '../images/HambMenu.png';
import Bell from '../images/Bell.png';
import Chats from '../images/Chats.png';
import JobSearch from '../images/JobSearch.png';
import Main from '../pages/MainPage';

const NavbarSocialhire = () => {

    const [searchInput, setSearchInput] = useState('');
    const [showModal, setShowModal] = useState(false); // State for modal visibility
    const [userName, setUserName] = useState(null); // Store the user's profile name

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        alert(`You typed: ${searchInput}. This function is not implemented yet`);
    };

    const handleClick = (message) => {
        alert(message);
    };


    useEffect(() => {
        const fetchUserProfile = async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                try {
                    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUserName(userData.firstName || "User"); // Replace with actual field for the name
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                }
            } else {
                setUserName(null); // User is not logged in
            }
        };

        fetchUserProfile();

        // Listen to auth state changes (optional for real-time updates)
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                fetchUserProfile();
            } else {
                setUserName(null); // Reset if user logs out
            }
        });

        return () => unsubscribe(); // Cleanup on unmount
    }, []);


    return (
        <>
            <Navbar style={{ backgroundColor: '#E2E2E2' }} expand="lg" id="nav-bar">
                <Container fluid className="d-flex align-items-center justify-content-between">
                    <Navbar.Brand href="/Main">
                        <img
                            alt="SocialHire"
                            src={brandLogo}
                            width="54"
                            height="54"
                            className="d-inline-block align-top"
                        />
                    </Navbar.Brand>
                    <Form className="search-bar" onSubmit={handleSearchSubmit}>
                        <Form.Control
                            type="text"
                            placeholder="Search"
                            className="searchbar"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <button
                            type="button"
                            className="filter-toggle-button"
                            onClick={() => setShowModal(true)} // Open the modal
                        >
                            Filters
                        </button>
                        <button type="submit" className="search-button">
                            <img
                                src={lookGlass}
                                alt="Search"
                                className="search-icon"
                            />
                        </button>
                    </Form>
                    <div className="icons-container">
                        <Link to="/JobSearch">
                            <img src={JobSearch} alt="Job Search" className="navbar-icon" />
                        </Link>
                        <img
                            src={Chats}
                            alt="Chats"
                            className="navbar-icon"
                            onClick={() => handleClick('Function not implemented yet')}
                        />
                        <img
                            src={Bell}
                            alt="Notifications"
                            className="navbar-icon"
                            onClick={() => handleClick('Function not implemented yet')}
                        />
                        <img
                            src={HambMenu}
                            alt="Menu"
                            className="navbar-icon"
                            onClick={() => handleClick('Function not implemented yet')}
                        />
                    </div>
                    <div className="profile-picture-1">
                        <Link className="profile-picture-navbar" to="/UserProfile">
                            <img
                                src={placeholderPic}
                                alt="Profile"
                                className="profile-pic"
                            />
                            <span className="profile-name">{userName || "Login"}</span>
                        </Link>
                    </div>
                </Container>
            </Navbar>

            {/* Add the SearchModal component */}
            <SearchModal show={showModal} onClose={() => setShowModal(false)} />
        </>
    );
};

export default NavbarSocialhire;
