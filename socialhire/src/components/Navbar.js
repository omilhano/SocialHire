import brandLogo from '../images/brandlogo.png';
import lookGlass from '../images/lookglass.png';
import placeholderPic from '../images/placeholderPic.jpg';
import HambMenu from '../images/HambMenu.png';
import Bell from '../images/Bell.png';
import Chats from '../images/Chats.png';
import JobSearch from '../images/JobSearch.png';
import React, { useState } from 'react';
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
                    <img src={JobSearch} alt="Job Search" className="navbar-icon" />
                    <img src={Chats} alt="Chats" className="navbar-icon" />
                    <img src={Bell} alt="Notifications" className="navbar-icon" />
                    <img src={HambMenu} alt="Menu" className="navbar-icon" />
                </div>
                <div className="profile-picture">
                    <img
                        src={placeholderPic} // note, this will need to be able to change somehow
                        alt="Profile"
                        className="profile-pic"
                    />
                    <span className="profile-name">Name</span>
                </div>
            </Container>
        </Navbar>
    );
};

export default NavbarSocialhire;
