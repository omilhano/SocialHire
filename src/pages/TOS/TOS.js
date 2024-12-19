import React from 'react';
import Container from 'react-bootstrap/Container';
import TOScomponent from './components/TOScomponent';
import './components/TOScomponent.css';

const TOS = () => {

  // List definitions
  const definitions = [
    { term: "User", description: "Refers to any individual or entity using the Platform, including both Employees and Employers." },
    { term: "Employee", description: "Refers to users seeking gigs, jobs, or employment opportunities." },
    { term: "Employer", description: "Refers to users posting job openings, hiring for gigs, or seeking candidates for positions." },
    { term: "Services", description: "Refers to all features, functionalities, content, and services available through the Platform." },
    { term: "Account", description: "Refers to the profile created by the User on SocialHire." }
  ];

  // List Account Creations 
  const accountTerms = [
    {
      term: "Account Creation", description: "To access certain features, you must create an Account. You agree to provide accurate, current, and complete information and to update it as necessary."
    },
    {
      term: "Account Responsibility", description: "You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your Account."
    },
    {
      term: "Unauthorized Access", description: "If you suspect any unauthorized access or use of your Account, you must notify us immediately."
    }
  ];

  // List Eligibility
  const eligibilityTerms = [
    {
      term: "Age Requirement",
      description: "To use the Platform, you must be at least 18 years old, or the legal age of majority in your jurisdiction."
    },
    {
      term: "Accurate Information",
      description: "Provide accurate, current, and complete information during registration."
    },
    {
      term: "Compliance with Laws",
      description: "Comply with all applicable laws, regulations, and these Terms."
    }
  ];


  // List Platform Usage
  const platformUsageTerms = [
    {
      term: "Employee Activities", description: "Employees may post their job-seeking status, apply for job openings, and interact with Employers."
    },
    {
      term: "Employer Activities", description: "Employers may post job openings, view applications, and hire Employees."
    },
    {
      term: "Shared Platform Features", description: "Both Employees and Employers can engage in chatting, recommend candidates, repost job listings, and process payments through the platform."
    },
    {
      term: "Prohibited Activities", description: "You may not use the Platform for illegal activities, fraudulent behavior, harassment, or to post harmful content."
    },
    {
      term: "Account Suspension", description: "SocialHire reserves the right to suspend or terminate accounts for violations of these Terms."
    }
  ];

  // List User content 
  const contentTerms = [
    {
      term: "User Content Upload", description: "Users may upload, post, or transmit content (e.g., job postings, personal profiles, comments) on the Platform."
    },
    {
      term: "Content Ownership and License", description: "You retain ownership of the content you post but grant SocialHire a non-exclusive, worldwide, royalty-free license to use, display, and distribute such content for the purpose of providing the Services."
    },
    {
      term: "Responsibility for Content", description: "You are solely responsible for the content you post and agree not to upload content that violates these Terms or the rights of others."
    }
  ];

  // List Payment
  const paymentTerms = [
    {
      term: "Payment for Services",
      description: "Payments for job postings, hiring, and gigs will be processed through the platform. Users agree to use the payment methods available on the platform to complete transactions."
    },
    {
      term: "Fees and Commissions",
      description: "Fees and commissions may apply for certain features, such as boosting job postings or processing payments. All fees are clearly outlined before completing any transaction."
    },
    {
      term: "Processing Fees and Modifications",
      description: "SocialHire may charge a processing fee for payments and retains the right to modify payment-related terms at its discretion."
    }
  ];

  // List Review
  const reviewTerms = [
    {
      term: "Ratings and Reviews",
      description: "Both Employers and Employees may rate and review each other after a transaction."
    },
    {
      term: "Public Visibility",
      description: "Ratings are publicly visible and intended to foster transparency and trust between users."
    },
    {
      term: "Prohibited Behavior",
      description: "Users are prohibited from manipulating or posting false reviews, and SocialHire reserves the right to remove inappropriate reviews or ratings."
    }
  ];

  // List Strike and Reporting Terms
  const strikeAndReportingTerms = [
    {
      term: "Strike System",
      description: "SocialHire has a strike system to address serious breaches of these Terms. Users may receive penalties, including account restrictions or bans, depending on the severity of their violations."
    },
    {
      term: "Reporting Inappropriate Behavior",
      description: "Users can report inappropriate behavior or content through the reporting feature on the platform. Administrators will review reports and take action when necessary."
    }
  ];

  // List Privacy Terms
  const privacyTerms = [
    {
      term: "Data Collection and Consent",
      description: "By using SocialHire, you consent to the collection, use, and sharing of your data as described in our Privacy Policy."
    },
    {
      term: "Privacy and Security",
      description: "SocialHire takes your privacy seriously and employs security measures to protect your data. However, we cannot guarantee the absolute security of your data."
    }
  ];

  // List Termination of account
  const accountTerminationTerms = [
    {
      term: "User-Initiated Account Termination",
      description: "You may terminate your Account at any time by contacting SocialHire’s support team or through your Account settings."
    },
    {
      term: "SocialHire-Initiated Account Termination",
      description: "SocialHire reserves the right to suspend or terminate your Account at its discretion, especially if there is a violation of these Terms."
    },
    {
      term: "Consequences of Termination",
      description: "Upon termination, you will lose access to your profile, job postings, and any associated data."
    }
  ];

  // List indemnification
  const indemnificationTerms = [
    {
      term: "Indemnification Agreement",
      description: "You agree to indemnify, defend, and hold SocialHire, its affiliates, officers, employees, and agents harmless from and against any claims, damages, losses, liabilities, or expenses (including reasonable attorneys' fees) arising from:"
    },
    {
      term: "Use of the Platform",
      description: "Your use of the Platform, including any job postings, applications, or interactions between Users."
    },
    {
      term: "Job or Gig-related Injuries or Losses",
      description: "Any injuries, damages, or losses that occur during the course of a job or gig, including but not limited to physical injuries, accidents, or property damage."
    },
    {
      term: "Criminal Activities and Unlawful Behavior",
      description: "Any criminal activities, felonies, or unlawful behavior committed by you or any other user in connection with the job or gig."
    },
    {
      term: "Breach of Terms or Legal Violations",
      description: "Any breach of these Terms, violation of applicable laws, or infringement of the rights of any third party."
    },
    {
      term: "SocialHire's Non-Responsibility",
      description: "SocialHire is not responsible for any injuries, accidents, or criminal actions that may occur during the performance of a job or gig posted on the Platform. Users are solely responsible for ensuring the safety and legality of their actions and the actions of those they hire or work with through the Platform."
    }
  ];

  // List liability 
  const liabilityTerms = [
    {
      term: "Limitation of Liability",
      description: "To the fullest extent permitted by law, SocialHire will not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform or any interactions between users."
    },
    {
      term: "Total Liability Cap",
      description: "SocialHire’s total liability for any claims related to these Terms will not exceed the amount you have paid to SocialHire during the six months prior to the claim."
    }
  ];

  // List Modification
  const modicationTerms = [
    {
      term: "Modification Terms",
      description: "SocialHire reserves the right to modify these Terms at any time. Changes will be posted on this page, and your continued use of the Platform after changes are made constitutes acceptance of the new Terms."
    }
  ]

  // List Governing
  const governingLawTerms = [
    {
      term: "Governing Law",
      description: "These Terms will be governed by and construed in accordance with the laws of Lisbon, without regard to its conflict of law principles."
    },
    {
      term: "Dispute Resolution",
      description: "Any disputes arising from these Terms will be resolved through binding arbitration in Lisbon, under the rules of the APA (Associação Portuguesa de Arbitragem)."
    }
  ];

  // List contact
  const contactAndAcknowledgmentTerms = [
    {
      term: "Contact Information",
      description: "If you have any questions or concerns about these Terms, please contact us at:\nEmail: socialhireims@gmail.com"
    },
    {
      term: "Acknowledgment of Terms",
      description: "By using SocialHire, you acknowledge and agree to these Terms of Service."
    }
  ];



  return (
    <div>
      <h1 style={{ textAlign: 'center', marginTop: '20px' }}>Terms of Service</h1>
      {/* <UnderConstruction /> */}
      <Container className='terms-of-service-background'>
        <div className='terms-of-service-header'>
          <div className='TOS-header-text'>
            <p id='date-TOS'>Effective Date: December 2024</p>
            <p id='TOS-intro'>Welcome to SocialHire! These Terms of Service ("Terms")
              govern your access to and use of the SocialHire platform, including all features,
              content, and services provided through the website and mobile application (the "Platform").
              By accessing or using the Platform, you agree to comply with and be bound by these Terms.
              If you do not agree to these Terms, you may not use the Platform.
            </p>
          </div>
          {/* Definitions */}
          <TOScomponent
            title="1. Definitions"
            definitions={eligibilityTerms}
          />

          {/* Eligibility */}
          <TOScomponent
            title="2. Eligibility"
            definitions={definitions}
          />

          {/* Account */}
          <TOScomponent
            title="3. Account Creation"
            definitions={accountTerms}
          />

          {/* Use of the platform */}
          <TOScomponent
            title="4. Use of the platform"
            definitions={platformUsageTerms}
          />

          {/* User content */}
          <TOScomponent
            title="5. User content"
            definitions={contentTerms}
          />

          {/* Payment Processing */}
          <TOScomponent
            title="6. Payment Processing"
            definitions={paymentTerms}
          />

          {/* Rating and Reviews */}
          <TOScomponent
            title="7. Rating and Reviews"
            definitions={reviewTerms}
          />

          {/* Rating and Reviews */}
          <TOScomponent
            title="8. Strikes and Reporting"
            definitions={strikeAndReportingTerms}
          />

          {/* Privacy and Reporting  */}
          <TOScomponent
            title="9. Privacy and Reporting"
            definitions={privacyTerms}
          />

          {/* Account termination */}
          <TOScomponent
            title="10. Termination of account"
            definitions={accountTerminationTerms}
          />

          {/* Indemnification */}
          <TOScomponent
            title="11. Indemnification"
            definitions={indemnificationTerms}
          />

          {/* Indemnification */}
          <TOScomponent
            title="12. Limitation of liability"
            definitions={liabilityTerms}
          />

          {/* Modification */}
          <TOScomponent
            title="13. Modifications to the Terms"
            definitions={modicationTerms}
          />

          {/* Governing */}
          <TOScomponent
            title="14. Governing Law and Dispute Resolution"
            definitions={governingLawTerms}
          />

          {/* Indemnification */}
          <TOScomponent
            title="15. Contact us"
            definitions={contactAndAcknowledgmentTerms}
          />
        </div>
      </Container>
    </div>
  );
};

export default TOS;
