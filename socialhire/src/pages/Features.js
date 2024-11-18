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
import Shieldpng from '../images/shield.png';
import Shieldwebp from '../images/shield.webp';
import Surveypng from '../images/survey.png';
import Surveywebp from '../images/survey.webp';
import SocialMediapng from '../images/socialmedia.png';
import SocialMediawebp from '../images/socialmedia.webp';
import Promotionpng from '../images/promotion.png';
import Promotionwebp from '../images/promotion.webp';
import Romancepng from '../images/romance.png';
import Romancewebp from '../images/romance.webp';
import ToTheMoonpng from '../images/tothemoon.png';
import ToTheMoonwebp from '../images/tothemoon.webp';
import WebsiteFeatureButton from '../components/WebsiteButton';
import RightSidedFeature from '../components/RightSided';


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

                <LeftSidedFeature
                    imageWebp={Dealwebp}
                    imagePng={Dealpng}
                    title="Close Deals"
                    description="Simplify the job-hiring process with streamlined tools to finalize agreements quickly and efficiently, whether for formal or informal work opportunities."
                    buttons={[CompanyFeatureButton, UserFeatureButton]}
                />

                <RightSidedFeature
                    imageWebp={SocialMediawebp}
                    imagePng={SocialMediapng}
                    title="Network"
                    description="Connect with professionals and companies in your sector, build meaningful relationships, and discover new opportunities through personalized recommendations."
                    buttons={[UserFeatureButton]}
                />

                <LeftSidedFeature
                    imageWebp={Adswebp}
                    imagePng={Adspng}
                    title="Posting"
                    description="Share job openings or project opportunities with ease. Our platform supports tailored posts for both formal roles and informal gigs, ensuring your needs are met."
                    buttons={[CompanyFeatureButton, UserFeatureButton]}
                />

                <RightSidedFeature
                    imageWebp={Promotionwebp}
                    imagePng={Promotionpng}
                    title="Ratings"
                    description="Foster trust in the community with our transparent rating system, allowing users to evaluate and be evaluated for their roles as workers, job providers, or companies."
                    buttons={[CompanyFeatureButton, UserFeatureButton]}
                />

                <LeftSidedFeature
                    imageWebp={Paymentwebp}
                    imagePng={Paymentpng}
                    title="Secure Payment"
                    description="Handle payments safely within the platform for all informal jobs, ensuring reliability and convenience for both parties."
                    buttons={[UserFeatureButton]}
                />

                <RightSidedFeature
                    imageWebp={Romancewebp}
                    imagePng={Romancepng}
                    title="Chatting area"
                    description="Communicate seamlessly with other users through our integrated chat feature, designed to help you discuss job details and build connections."
                    buttons={[CompanyFeatureButton, UserFeatureButton]}
                />

                <LeftSidedFeature
                    imageWebp={Shieldwebp}
                    imagePng={Shieldpng}
                    title="Security"
                    description="Encryption: Enjoy peace of mind knowing your data and conversations are protected with end-to-end encryption, prioritizing your security and privacy.
                    Reporting and Moderation: Keep the community safe with tools to report inappropriate content, backed by a robust strike system to enforce platform rules fairly."
                    buttons={[WebsiteFeatureButton]}
                />

                <RightSidedFeature
                    imageWebp={ToTheMoonwebp}
                    imagePng={ToTheMoonpng}
                    title="Boosted Visibility"
                    description="Increase exposure for your posts or ads with boosting options, ensuring they reach the right audience quickly."
                    buttons={[CompanyFeatureButton, UserFeatureButton]}
                />

                <LeftSidedFeature
                    imageWebp={Surveywebp}
                    imagePng={Surveypng}
                    title="Smart Search Filters"
                    description="Easily find the right job, hustle, or connection using advanced search tools with customizable filters for more precise results."
                    buttons={[WebsiteFeatureButton]}
                />
            </div>
        </Container>
    );
};

export default Features;
