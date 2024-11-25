import React from 'react';
import emailjs from '@emailjs/browser';


export const sendWelcomeEmail = (formData) => {
    emailjs
        .send(
            process.env.REACT_APP_EMAILJS_SERVICE_ID,     // Replace with your Email.js service ID
            process.env.REACT_APP_EMAILJS_TEMPLATE_ID, // Replace with your Email.js template ID
            {
                from_name: 'SocialHire',
                to_email: formData.email,
                to_name: `${formData.firstName} ${formData.lastName}`,
                message: `Welcome to our platform, ${formData.firstName}!`,
            },
            process.env.REACT_APP_EMAILJS_PUBLIC_KEY       // Replace with your Email.js public key
        )
        .then(
            (result) => {
                console.log('Email sent successfully:', result.text);
            },
            (error) => {
                console.error('Failed to send email:', error);
            }
        );
};

export default sendWelcomeEmail;
