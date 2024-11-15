import brandLogo from '../images/brandlogo.png';
import lookGlass from '../images/lookglass.png';
import placeholderPic from '../images/placeholderPic.jpg';
import HambMenu from '../images/HambMenu.png';
import Bell from '../images/Bell.png';
import Chats from '../images/Chats.png';
import JobSearch from '../images/JobSearch.png';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import '../styles/Navbar.css';

const NavbarSocialhire = () => {
    // Unimplemented search bar
    const [searchInput, setSearchInput] = useState('');

    const handleSearchSubmit = (e) => {
        e.preventDefault(); // Prevent page reload on form submission
        alert(`You typed: ${searchInput}. This function is not implemented yet`);
    };
    // unimplemented notifications, hamburgerMenu and chats
    const handleClick = (message) => {
        alert(message);
    };
    return (
        <Navbar style={{ backgroundColor: '#E2E2E2' }} expand="lg" id="nav-bar">
            <Container fluid className="d-flex align-items-center justify-content-between"> {/* for alex to look*/}
                <Navbar.Brand href="/">
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
                        value={searchInput} //form submission code
                        onChange={(e) => setSearchInput(e.target.value)} //form submission code
                    />
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
                    <Link className='profile-picture' to="/Profile">
                        <img
                            src={placeholderPic}// note, this will need to be able to change somehow
                            alt="Profile"
                            className="profile-pic"
                        />
                        <span className="profile-name">Name</span>
                    </Link>
                </div>
            </Container>
        </Navbar>
    );
};

export default NavbarSocialhire;
