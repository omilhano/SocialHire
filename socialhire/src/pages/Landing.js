import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Landing.css';
import Container from 'react-bootstrap/Container';

const Landing = () => {
    const navigate = useNavigate();
    return (
        <Container fluid id='background'>
            <div className="landing-container">
                <div className="landing-content">
                    <div className='landing-text'>
                        <p className="landing-description">
                            Land your next opportunity through the power of personal recommendation
                        </p>
                        <p className="landing-span">
                            Connect with your network to discover job opportunities and help others grow their careers, all based on trust and community.
                        </p>
                    </div>
                    <div className="landing-forms">
                        <p className='forms-span'>
                            Ready to take the opportunity?
                        </p>
                        <div className='table-forms'>
                            <button id='login' onClick={() => navigate('./SignIn')}>Log In</button>
                            <p className='decide'>OR</p>
                            <button id='joinus' onClick={() => navigate('./SignUp')}>Join Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default Landing;
{/* <div className="landing-buttons">
                        <button
                            onClick={() => navigate('./SignIn')}
                            className="button-primary"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate('./SignUp')}
                            className="button-secondary"
                        >
                            Register
                        </button>
                    </div> */}