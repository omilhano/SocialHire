import brandLogo from '../images/brandlogo.png';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Landing from '../pages/Landing';


const NavbarSocialhire = () => {
    return (
        <Navbar className="justify-content-space-between" id='nav-bar'>
            <Container fluid>
                <Navbar.Brand href="/">
                    <img
                        alt="SocialHire"
                        src={brandLogo}
                        width="50"
                        height="50"
                        className="justify-content-left"
                        color='#E5E5E5'
                    />{' '}
                </Navbar.Brand>
                <ul><li>
                    <a href='#'>Menu</a>
                </li>
                </ul>
            </Container>
        </Navbar>
    );
};

export default NavbarSocialhire;