// Features.js
import React from 'react';
import '../styles/Features.css';
import Container from 'react-bootstrap/Container';
import LeftSidedFeature from '../components/LeftSided';
import CompanyFeatureButton from '../components/CompanyButton';
import UserFeatureButton from '../components/UserButton';
import Dealwebp from '../images/businessdeal.webp';
import Dealpng from '../images/businessdeal.png';
import Adspng from '../images/digitaladspng.png';
import Adswebp from '../images/digitaladswebp.webp';
import Paymentpng from '../images/payment.png';
import Paymentwebp from '../images/payment.webp';

const Features = () => {
    return (
        <Container fluid id='background' className="g-0">
            <div className='features-header'>
                <div className='features-text'>
                    <h2>Features</h2>
                    <p>SocialHire is equipped with features that maximize your possibilities to get
                        that job or to hire the perfect workforce.
                    </p>
                </div>

                {/* First Left Sided Feature with 2 Buttons */}
                <LeftSidedFeature
                    imageWebp={Dealwebp}
                    imagePng={Dealpng}
                    title="Close Deals"
                    description="Simplify the job-hiring process with streamlined tools to finalize agreements quickly and efficiently, whether for formal or informal work opportunities."
                    buttons={[CompanyFeatureButton, UserFeatureButton]} // Two buttons
                />

                <LeftSidedFeature
                    imageWebp={Adswebp}
                    imagePng={Adspng}
                    title="Posting"
                    description="Share job openings or project opportunities with ease. Our platform supports tailored posts for both formal roles and informal gigs, ensuring your needs are met."
                    buttons={[CompanyFeatureButton, UserFeatureButton]}
                />

                <LeftSidedFeature
                    imageWebp={Paymentwebp}
                    imagePng={Paymentpng}
                    title="Secure Payment"
                    description="Handle payments safely within the platform for all informal jobs, ensuring reliability and convenience for both parties."
                    buttons={[UserFeatureButton]}
                />
            </div>
        </Container>
    );
};

export default Features;
