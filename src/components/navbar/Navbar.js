// Importing necessary libraries, components, and assets
import React, { useState, useEffect } from 'react'; // React and hooks for state and lifecycle management
import { Link, useNavigate } from 'react-router-dom'; // React Router for navigation and linking
import { auth, db, storage } from "firebaseConfig"; // Firebase configuration for authentication, Firestore, and storage
import {
    doc, getDoc, updateDoc, collection, query, where, orderBy, limit, getDocs
} from "firebase/firestore"; // Firestore methods for database operations
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage methods for file management
import Container from 'react-bootstrap/Container'; // Bootstrap container for responsive layout
import Navbar from 'react-bootstrap/Navbar'; // Bootstrap Navbar for navigation
import Form from 'react-bootstrap/Form'; // Bootstrap Form for input and submission

// TODO Navbar
import './Navbar.css'; // Custom CSS for Navbar styling

import SearchModal from 'components/filtersModal/FiltersModal'; // Modal component for filters
import NotificationModal from './NotificationsModal'; // Modal component for notifications
import brandLogo from 'images/brandlogo.png'; // Branding logo
import lookGlass from 'images/lookglass.png'; // Search icon
import placeholderPic from 'images/placeholderPic.jpg'; // Placeholder profile picture
import HambMenu from 'images/HambMenu.png'; // Hamburger menu icon
import Bell from 'images/Bell.png'; // Notification bell icon
import Chats from 'images/Chats.png'; // Chats icon
import JobSearch from 'images/JobSearch.png'; // Job search icon
import Main from 'pages/main/MainPage'; // Main page component

// Navbar component for the SocialHire app
// "Takes in filters to pass to parent component: App.Js"
const NavbarSocialhire = ({ filters, setFilters }) => {
    const navigate = useNavigate(); // Hook for programmatic navigation
    const [searchInput, setSearchInput] = useState(''); // State to store the search query
    const [showModal, setShowModal] = useState(false); // State to toggle the visibility of the filter modal
    const [showNotificationModal, setShowNotificationModal] = useState(false); // State to toggle the visibility of the notification modal
    const [userName, setUserName] = useState(null); // State to store the logged-in user's name


    // Handles form submission for search functionality
    const handleSearchSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        alert(`You typed: ${searchInput}. This function is not implemented yet`); // Placeholder alert
    };

    // Placeholder handler for unimplemented functions
    const handleClick = (message) => {
        alert(message);
    };

    // Fetch the logged-in user's profile data from Firestore
    useEffect(() => {
        const fetchUserProfile = async () => {
            const currentUser = auth.currentUser; // Get the currently logged-in user
            if (currentUser) {
                try {
                    // Fetch the user's document from the "users" collection
                    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data(); // Extract user data
                        setUserName(userData.username || "User"); // Set user's first name or a default
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                }
            } else {
                setUserName(null); // If no user is logged in, reset the name
            }
        };

        fetchUserProfile(); // Fetch profile on component mount

        // Optional: Listen for real-time auth state changes
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                fetchUserProfile(); // Re-fetch profile if user logs in
            } else {
                setUserName(null); // Reset name if user logs out
            }
        });

        return () => unsubscribe(); // Clean up the listener on unmount
    }, []);

    return (
        <>
            {/* Navbar structure */}
            <Navbar style={{ backgroundColor: '#E2E2E2' }} expand="lg" id="nav-bar">
                <Container fluid className="d-flex align-items-center justify-content-between">
                    {/* Brand logo */}
                    <Navbar.Brand href="/Main">
                        <img
                            alt="SocialHire"
                            src={brandLogo}
                            width="54"
                            height="54"
                            className="d-inline-block align-top"
                        />
                    </Navbar.Brand>

                    {/* Search bar with filters */}
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
                            onClick={() => setShowModal(true)} // Show filter modal
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

                    {/* Navbar icons */}
                    <div className="icons-container">
                        <Link to="/JobSearch">
                            <img src={JobSearch} alt="Job Search" className="navbar-icon" />
                        </Link>
                        <img
                            src={Chats}
                            alt="Chats"
                            className="navbar-icon"
                            onClick={() => navigate('/ChatPage')}
                        />
                        <img
                            src={Bell}
                            alt="Notifications"
                            className="navbar-icon"
                            onClick={() => setShowNotificationModal(true)} // Show notification modal
                        />
                        <img
                            src={HambMenu}
                            alt="Menu"
                            className="navbar-icon"
                            onClick={() => handleClick('Function not implemented yet')}
                        />
                    </div>

                    {/* User profile picture and name */}
                    <div className="profile-picture-1">
                        <Link className="profile-picture-navbar" 
                        to={userName ? `/profile/${userName}` : "/login"} >
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

            {/* Modals for filters and notifications */}
            <SearchModal show={showModal} onClose={() => setShowModal(false)} filters={filters} setFilters={setFilters} />
            <NotificationModal show={showNotificationModal} onClose={() => setShowNotificationModal(false)} />
        </>
    );
};

export default NavbarSocialhire;
