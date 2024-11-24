import React from 'react';
import '../styles/AboutUs.css';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Diversity from '../images/Diversity.jpg';
import Scratch from '../images/scratch.png';
import Explode from '../images/explode.png';
import Alex from '../images/SocialHirealex.png';
import Brenda from '../images/SocialHirebrenda.png';
import Eli from '../images/SocialHireeli.png';
import Dash from '../images/dashhalf.png';
import Diamond from '../images/doublediamond.png';
import useRedirectIfLoggedIn from "../hooks/useRedirectIfLoggedIn";


// TODO images
const About = () => {
    useRedirectIfLoggedIn(); // Hook to redirect logged-in users
    return (
        <Container fluid id='background' className="g-0">
            <div className='aboutus-container-top'>
                <div className='image-left'>
                    <img src={Diversity}></img>
                </div>
                <div className='aboutus-text'>
                    <h2 id='aboutus-title'>About SocialHire</h2>
                    <p id='aboutus-smalltext'>We are your new favourite job hunting and gig seeking platform.</p>
                    <p id='aboutus-smalltext'>Join a community based on transperency and trust.</p>
                    <p id='aboutus-smalltext'>Search for job openings in your network of known friends,
                        repost jobs, recommend friends and much more.</p>
                </div>
                <div className='image-right'>
                    <img src={Scratch}></img>
                    <img src={Explode}></img>
                </div>
            </div>
            <div className='aboutus-founders'>
                <div className='aboutus-founders-header'>
                    <div className='filler-left'></div>
                    <div className='about-founders-text'>
                        <h2 id='founders-text'>The Co-founders</h2>
                    </div>
                    <div className='filler-right'></div>
                </div>
                <div className='founders-cards'>
                    <Card style={{ width: '18rem' }}>
                        <Card.Img variant="top" src={Alex} style={{ 'maxHeight': '310px', 'width': '100%' }} />
                        <Card.Body style={{ 'background-color': '#177B7B' }}>
                            <Card.Title style={{ 'color': '#E5E5E5' }}>Alexandre Francisco</Card.Title>
                            <Card.Text style={{ 'color': '#E5E5E5' }}>
                                Some quick example text to build on the card title and make up the
                                bulk of the card's content.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card style={{ width: '18rem' }}>
                        <Card.Img variant="top" src={Brenda} style={{ 'maxHeight': '310px', 'width': '100%' }} />
                        <Card.Body style={{ 'background-color': 'rgba(23, 123, 123, 0.8)' }}>
                            <Card.Title style={{ 'color': '#E5E5E5' }}>Brenda Lima</Card.Title>
                            <Card.Text style={{ 'color': '#E5E5E5' }}>
                                “Well I always know someone that knows someone that would be perfect for a job!
                                After recommending many people to many jobs I could not help but wonder: How come there are no social networks that simplify this proccess?
                                All are so formal or do not take into consideration your contacts.
                                That is where SocialHire was born.
                                A way to take advantage on our own networks when searching for a job.”
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card style={{ width: '18rem' }}>
                        <Card.Img variant="top" src={Eli} style={{ 'maxHeight': '310px', 'width': '100%' }} />
                        <Card.Body style={{ 'background-color': 'rgba(23, 123, 123, 0.6)' }}>
                            <Card.Title style={{ 'color': '#E5E5E5' }}>Eli Godinho</Card.Title>
                            <Card.Text style={{ 'color': '#E5E5E5' }}>
                                Some quick example text to build on the card title and make up the
                                bulk of the card's content.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card style={{ width: '18rem' }}>
                        <Card.Img variant="top" src="holder.js/100px180" />
                        <Card.Body style={{ 'background-color': 'rgba(23, 123, 123, 0.4)' }}>
                            <Card.Title style={{ 'color': '#E5E5E5' }}>Simon Sazonov</Card.Title>
                            <Card.Text style={{ 'color': '#E5E5E5' }}>
                                Some quick example text to build on the card title and make up the
                                bulk of the card's content.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
            </div>
            <div className='aboutus-bottom'>
                <div className='aboutus-botom-images'>
                    <img src={Dash}></img>
                    <img src={Diamond}></img>
                </div>
                <div className='aboutus-botom-text'>
                    <p>SocialHire is a platform that focuses on</p>
                    <p>We hope to change the job hunting market bench through this new sense of online community.</p>
                    <p>Join us in this mission.</p>
                </div>
                <div className='aboutus-fill'>
                </div>
            </div>
        </Container>
    );
};

export default About;