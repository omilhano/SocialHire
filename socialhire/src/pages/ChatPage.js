import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import lookGlass from '../images/lookglass.png';
import '../styles/ChatPage.css'


const ChatPage = () => {
    const [searchInput, setSearchInput] = useState('');
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        alert(`You typed: ${searchInput}. This function is not implemented yet`);
    };
    return (
        <Container fluid id='background' className="g-0">
            <div className='chat-page-body'>
                <div className='chat-header'>
                    <p id='header-text'>Messaging</p>
                    <Form className="search-bar" onSubmit={handleSearchSubmit}>
                        <Form.Control
                            type="text"
                            placeholder="Search"
                            className="searchbar-header"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <button type="submit" className="search-button">
                            <img
                                src={lookGlass}
                                alt="Search"
                                className="search-icon"
                            />
                        </button>
                    </Form>
                </div>
                <div className='chat-body'>
                    <div className='chat-sidebar'></div>
                    <div className='chat-focus'></div>
                </div>

            </div>
        </Container>

    );
};

export default ChatPage;

