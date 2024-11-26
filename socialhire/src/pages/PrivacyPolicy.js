import React from 'react';
import UnderConstruction from '../components/UnderConstruction';
import PolicyComponent from '../components/PolicyComponent';
import Container from 'react-bootstrap/Container';

// TODO change nav
const PrivacyPolicy = () => {

  // List Information We Collect
  const informationWeCollect = [
    {
      type: "Personal Information",
      description: "Name, email address, phone number, and profile details provided during sign-up or profile creation."
    },
    {
      type: "Company Information",
      description: "For company accounts, we collect data such as company name, location, and job posting details."
    },
    {
      type: "Payment Information",
      description: "For transactions within the platform, including secure payment processing."
    },
    {
      type: "Activity Data",
      description: "Information about your usage of the platform, including posts, applications, and interactions."
    },
    {
      type: "Device and Log Data",
      description: "Technical information, such as IP address, browser type, and access times, to optimize platform performance."
    }
  ];

  // List How We Use Your Data
  const dataUsage = [
    {
      type: "Facilitate Job Postings and Networking",
      description: "Enable job postings, applications, and professional networking on the platform."
    },
    {
      type: "Process Payments",
      description: "Handle secure payments and manage commissions for transactions within the platform."
    },
    {
      type: "Improve Platform Functionality",
      description: "Enhance platform features and user experience based on usage data."
    },
    {
      type: "Provide Customer Support",
      description: "Address user inquiries and deliver customer support services."
    },
    {
      type: "Communicate Updates",
      description: "Send updates, promotions, or notify users about changes in policies."
    }
  ];

  // List How We Share Your Data
  const dataSharing = [
    {
      type: "Service Providers",
      description: "Share with third-party vendors for payment processing, analytics, or customer support."
    },
    {
      type: "Legal Compliance",
      description: "Share to comply with laws, regulations, or legal processes."
    },
    {
      type: "With Other Users",
      description: "Information on your profile is shared as part of the platform's functionality (e.g., job applications or recommendations)."
    },
    {
      type: "Do Not Sell Personal Information",
      description: "We do not sell your personal information."
    }
  ];



  return (
    <div>
      <h1 style={{ textAlign: 'center', marginTop: '20px' }}>Privacy Policy</h1>
      {/* <UnderConstruction /> */}
      <Container className='policy-component-background'>
        <div className='privacy-policy-header'>
          <div className='privacy-policy-text'>
            <p id='data-policy'>Effective Date: December 2024</p>
            <p id='policy-intro'>At SocialHire, we value your trust and are committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our platform.
              By using SocialHire, you agree to the practices described below.</p>
          </div>
          {/* Information we collect */}
          <PolicyComponent
            title="1. Information we collect"
            definitions={informationWeCollect}
          />

          {/* How we use your information */}
          <PolicyComponent
            title="2. How we use your information"
            definitions={dataUsage}
          />

          {/* How we share your information */}
          <PolicyComponent
            title="3. How we share your information"
            definitions={dataSharing}
          />

          {/* Data security */}
          <PolicyComponent
            title="4. Data security"
            definitions={dataSharing}
          />
        </div>
      </Container>
    </div>
  );
};

export default PrivacyPolicy;
