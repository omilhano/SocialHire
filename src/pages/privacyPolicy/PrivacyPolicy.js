import React from 'react';
import PolicyComponent from './components/PolicyComponent';
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

  // List Security
  const security = [
    {
      type: "Industry-standard",
      description: "We use industry-standard encryption and security practices to protect your data. However, no system is completely secure. Please notify us immediately if you suspect unauthorized access to your account."
    }
  ]

  // List Your rights
  const personalDataRights = [
    {
      type: "Access and Update",
      description: "View and modify your account information at any time."
    },
    {
      type: "Data Deletion",
      description: "Request deletion of your account and associated data."
    },
    {
      type: "Opt-Out",
      description: "Manage email preferences or marketing communications."
    },
    {
      type: "Cookies",
      description: "Adjust your browser settings to control cookies."
    }
  ];

  // List Cookies and policy
  const cookiesPolicy = [
    {
      type: "Enhancing User Experience",
      description: "Improve platform navigation and user experience."
    },
    {
      type: "Usage Analysis",
      description: "Analyze usage patterns and optimize features."
    },
    {
      type: "Targeted Advertising",
      description: "Deliver relevant advertisements or promotions."
    },
    {
      type: "Consent",
      description: "By using SocialHire, you consent to our use of cookies."
    }
  ];

  // List Children's Privacy
  const child = [
    {
      type: "Use Not Allowed",
      description: "SocialHire is not intended for users under the age of 18. We do not knowingly collect data from children."
    }
  ]

  // List changes
  const changespolicy = [
    {
      type: "Changes",
      description: "We may update this Privacy Policy to reflect changes in our practices. Significant changes will be communicated to you via email or a notification on the platform."
    }
  ]

  // List contact
  const privacyPolicyContact = [
    {
      type: "Contact Information",
      description: "If you have any questions or concerns about this Privacy Policy, please contact us at:\nEmail: socialhireims@gmail.com"
    },
    {
      type: "Acknowledgment of Privacy Policy",
      description: "By using SocialHire, you acknowledge and agree to this Privacy Policy."
    }
  ];



  return (
    <div>
      <h1 id='privacy-title' style={{ textAlign: 'center', marginTop: '20px' }}>Privacy Policy</h1>
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
            definitions={security}
          />

          {/* Your rights */}
          <PolicyComponent
            title="5. Your rights"
            definitions={personalDataRights}
          />

          {/* Your rights */}
          <PolicyComponent
            title="6. Cookies and tracking"
            definitions={cookiesPolicy}
          />

          {/* Children's Privacy */}
          <PolicyComponent
            title="7. Children's Privacy"
            definitions={child}
          />

          {/* Changes to this policy */}
          <PolicyComponent
            title="8. Changes to this policy"
            definitions={changespolicy}
          />

          {/* Contact us */}
          <PolicyComponent
            title="9. Contact us"
            definitions={privacyPolicyContact}
          />
        </div>
      </Container>
    </div>
  );
};

export default PrivacyPolicy;
