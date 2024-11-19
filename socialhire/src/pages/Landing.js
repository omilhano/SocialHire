import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Landing.css';
import Container from 'react-bootstrap/Container';
import Elipse from '../images/elipse.png';

const Landing = () => {
    const navigate = useNavigate();
    return (
        <Container fluid id='background' className="g-0">
            <div className="landing-container">
                <div className="landing-content">
                    <div className='landing-text'>
                        <p className="landing-description">
                            Land your next opportunity through the power of <span id='highlight-teal'>personal recommendation
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
                <div className='company-highlight'>
                    <div className='company-text'>
                        <h4 className='company-title'>
                            Companies
                        </h4>
                        <p className='company-description'>
                            Are you looking for formal job on your field?
                            Or perhaps it has been hard to find the perfect match for that open vacancy at your company...
                            Land the job by being recommended from one contact from inside.
                            Build your workforce on top of your best personnel.
                        </p>
                    </div>
                    <div className='company-actions'>
                        <p className='company-actions-text'>
                            As a company you can post job openings and receive feedback from your own employees.
                            Let’s look into company profiles
                        </p>
                        <div className='company-actions-buttonsbox'>
                            <button className='actions-button'>Companies</button>
                        </div>
                    </div>
                </div>
                <div className='belief-section'>
                    <div className="belief-top">
                        <div className='belief-text'>
                            <h2 className='belief-text-title'>
                                At SocialHire we believe in Transparency
                            </h2>
                            <p className='belief-small-text'>
                                All Job Postings must contain the following mandatory descriptions.
                                Check beforehand if all requirements resonate with you, if not, pass to the next opportunity!
                            </p>
                        </div>
                        <div className="button-container">
                            <button className="custom-button">Button 1</button>
                            <button className="custom-button">Button 2</button>
                            <button className="custom-button">Button 3</button>
                            <button className="custom-button">Button 4</button>
                            <button className="custom-button">Button 5</button>
                            <button className="custom-button">Button 6</button>
                        </div>
                    </div>
                    <div className='belief-bottom'>
                        <img src={Elipse} alt='imagem of people holding hands' id='image-hands'></img>
                        <div className='belief-bottom-text'>
                            <h3 className='belief-bottom-title'>Your friends are your best recommendations</h3>
                            <p className='belief-bottom-small-text'>Let your friends
                                know about open slots in the company you work on and check
                                out opportunities they might be able to open up for you.
                            </p>
                            <h3 className='belief-bottom-title'>Friends with benefits!</h3>
                            <p className='belief-bottom-small-text'>Advise friends for gigs, when they earn you also earn for recommendation.
                            </p>
                            <h3 className='belief-bottom-title'>Chatting</h3>
                            <p className='belief-bottom-small-text'>
                                Use and abuse our chatting option to reach companies and
                                employers for the gigs you would like to apply to.
                            </p>
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