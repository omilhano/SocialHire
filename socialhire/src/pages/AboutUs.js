import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AboutUs.css';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Diversity from '../images/Diversity.jpg';
import Scratch from '../images/scratch.png';
import Explode from '../images/explode.png';

const About = () => {
    const navigate = useNavigate();
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
                        <Card.Img variant="top" src="holder.js/100px180" />
                        <Card.Body>
                            <Card.Title>Card Title</Card.Title>
                            <Card.Text>
                                Some quick example text to build on the card title and make up the
                                bulk of the card's content.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card style={{ width: '18rem' }}>
                        <Card.Img variant="top" src="holder.js/100px180" />
                        <Card.Body>
                            <Card.Title>Card Title</Card.Title>
                            <Card.Text>
                                Some quick example text to build on the card title and make up the
                                bulk of the card's content.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card style={{ width: '18rem' }}>
                        <Card.Img variant="top" src="holder.js/100px180" />
                        <Card.Body>
                            <Card.Title>Card Title</Card.Title>
                            <Card.Text>
                                Some quick example text to build on the card title and make up the
                                bulk of the card's content.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card style={{ width: '18rem' }}>
                        <Card.Img variant="top" src="holder.js/100px180" />
                        <Card.Body>
                            <Card.Title>Card Title</Card.Title>
                            <Card.Text>
                                Some quick example text to build on the card title and make up the
                                bulk of the card's content.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </Container>
    );
};

export default About;