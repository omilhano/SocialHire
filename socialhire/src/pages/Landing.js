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
                    <h1 className="landing-title">Welcome to SocialHire</h1>
                    <p className="landing-description">
                        Connect with professionals, discover opportunities, and build your career path
                        with our powerful networking platform.
                    </p>

                    <div className="landing-buttons">
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
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-title">Connect</div>
                            <p className="feature-description">
                                Build your professional network with like-minded individuals
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-title">Discover</div>
                            <p className="feature-description">
                                Find exciting job opportunities tailored to your skills
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-title">Grow</div>
                            <p className="feature-description">
                                Advance your career with professional development resources
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default Landing;