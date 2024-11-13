import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Landing.css';
import Container from 'react-bootstrap/Container';

const Landing = () => {
    const navigate = useNavigate();
    return (
        <Container fluid id='background' className="g-0">
            <div className="landing-container">
                <div className="landing-content">
                    <div className='landing-text'>
                        <p className="landing-description">
                            Land your next opportunity through the power of <span id='hightlight-teal'>personal recommendation
                            </span></p>
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
                <div className='landing-highlight'>
                    <div className='highlight-text'>
                        <h4 className='highlight-title'>
                            Users- Employee or Employer?
                        </h4>
                        <p className='highlight-description'>
                            Wether you need some help moving furniture or taking care of your pets
                            during vacation SocialHire helps you connect with someone that has these skills!
                            Between your trusted friends find the ideal candidate for the gig.
                        </p>
                    </div>
                    <div className='highlight-actions'>
                        <p className='actions-text'>
                            While being an user you can have two status.
                            let's find out more about them.
                        </p>
                        <div className='actions-buttonsbox'>
                            <button className='actions-button'>Employee</button>
                            <button className='actions-button'>Employer</button>
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