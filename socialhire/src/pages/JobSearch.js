import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import CreatingJobModal from '../components/CreatingJobModal';

const JobSearch = () => {
  const [showJobModal, setShowJobModal] = useState(false);

  // Open Modal
  const handleOpenModal = () => {
    setShowJobModal(true); // Set state to true to show the modal
  };

  return (
    <Container fluid id="background-main-page" className="g-0">
      <div className="grid-layout">
        {/* Sidebar */}
        <div className="layout-sidebar">
          <div className="sidebar-header">
            <div className="header-top">
              {/* Button to open the modal */}
              <button onClick={handleOpenModal}>Start Hiring</button>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="layout-main">
          <h1>Now hiring: </h1>
          {/* Render PostList component */}
          {/* <JobPosting /> */}
        </div>

        {/* Aside Section */}
        <div className="layout-aside">
          <div className="add-people">
            <h2>Before Applying: </h2>
            {/* Component to suggest precautions before accepting jobs */}
          </div>
        </div>
      </div>

      {/* Create Job Modal */}
      <CreatingJobModal
        show={showJobModal} // Pass the state to control visibility
        onClose={() => setShowJobModal(false)} // Close modal handler
      />
    </Container>
  );
};

export default JobSearch;
