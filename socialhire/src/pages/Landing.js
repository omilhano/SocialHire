// Importing necessary libraries, components, and assets
import React from 'react'; // React library for building components
import { useNavigate } from 'react-router-dom'; // Hook for programmatic navigation
import '../styles/Landing.css'; // Custom CSS for landing page styling
import Container from 'react-bootstrap/Container'; // Bootstrap Container for a fluid responsive layout
import Elipse from '../images/elipse.png'; // Image asset used in the belief section

// Landing page component
const Landing = () => {
    const navigate = useNavigate(); // React Router hook for navigation

    return (
        // Full-page container for the landing page background
        <Container fluid id='background' className="g-0">
            <div className="landing-container">
                {/* Top section: Main text and call-to-action buttons */}
                <div className="landing-content">
                    <div className='landing-text'>
                        {/* Introductory text describing the platform */}
                        <p className="landing-description">
                            Land your next opportunity through the power of <span id='highlight-teal'>personal recommendation</span>
                        </p>
                        <p className="landing-span">
                            Connect with your network to discover job opportunities and help others grow their careers, all based on trust and community.
                        </p>
                    </div>
                    {/* Login and Signup buttons */}
                    <div className="landing-forms">
                        <p className='forms-span'>Ready to take the opportunity?</p>
                        <div className='table-forms'>
                            <button id='login' onClick={() => navigate('./signin')}>Log In</button>
                            <p className='decide'>OR</p>
                            <button id='joinus' onClick={() => navigate('./signup')}>Join Now</button>
                        </div>
                    </div>
                </div>

                {/* Highlight section: Explains different user roles */}
                <div className='landing-highlight'>
                    <div className='highlight-text'>
                        <h4 className='highlight-title'>Users- Employee or Employer?</h4>
                        <p className='highlight-description'>
                            Whether you need some help moving furniture or taking care of your pets during vacation, 
                            SocialHire helps you connect with someone that has these skills! 
                            Between your trusted friends, find the ideal candidate for the gig.
                        </p>
                    </div>
                    <div className='highlight-actions'>
                        <p className='actions-text'>
                            While being a user, you can have two statuses. Let's find out more about them.
                        </p>
                        <div className='actions-buttonsbox'>
                            <button className='actions-button'>Employee</button>
                            <button className='actions-button'>Employer</button>
                        </div>
                    </div>
                </div>

                {/* Companies section: Explains company features */}
                <div className='company-highlight'>
                    <div className='company-text'>
                        <h4 className='company-title'>Companies</h4>
                        <p className='company-description'>
                            Are you looking for a formal job in your field? Or perhaps it has been hard to find the perfect 
                            match for that open vacancy at your company... 
                            Land the job by being recommended by someone inside. 
                            Build your workforce on top of your best personnel.
                        </p>
                    </div>
                    <div className='company-actions'>
                        <p className='company-actions-text'>
                            As a company, you can post job openings and receive feedback from your own employees. 
                            Let’s look into company profiles.
                        </p>
                        <div className='company-actions-buttonsbox'>
                            <button className='actions-button'>Companies</button>
                        </div>
                    </div>
                </div>

                {/* Belief section: Core values of the platform */}
                <div className='belief-section'>
                    {/* Top portion: Highlights mandatory job post details */}
                    <div className="belief-top">
                        <div className='belief-text'>
                            <h2 className='belief-text-title'>At SocialHire we believe in Transparency</h2>
                            <p className='belief-small-text'>
                                All job postings must contain the following mandatory descriptions. 
                                Check beforehand if all requirements resonate with you; if not, pass to the next opportunity!
                            </p>
                        </div>
                        {/* Buttons for job posting requirements */}
                        <div className="button-container">
                            <button className="custom-button">Date</button>
                            <button className="custom-button">Duration</button>
                            <button className="custom-button">Address</button>
                            <button className="custom-button">Time</button>
                            <button className="custom-button">Description</button>
                            <button className="custom-button">Payment</button>
                        </div>
                    </div>

                    {/* Bottom portion: Values and features */}
                    <div className='belief-bottom'>
                        {/* Image representing community */}
                        <img src={Elipse} alt='People holding hands' id='image-hands' />
                        <div className='belief-bottom-text'>
                            {/* Benefits and values of the platform */}
                            <h3 className='belief-bottom-title'>Your friends are your best recommendations</h3>
                            <p className='belief-bottom-small-text'>
                                Let your friends know about open slots in the company you work at and check 
                                out opportunities they might be able to open up for you.
                            </p>
                            <h3 className='belief-bottom-title'>Friends with benefits!</h3>
                            <p className='belief-bottom-small-text'>
                                Advise friends for gigs; when they earn, you also earn for recommending them.
                            </p>
                            <h3 className='belief-bottom-title'>Chatting</h3>
                            <p className='belief-bottom-small-text'>
                                Use and explore our chat feature to reach companies and 
                                employers for the gigs you want to apply for.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default Landing;
