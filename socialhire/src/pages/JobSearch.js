import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import CreatingJobModal from '../components/CreatingJobModal';
import JobList from '../components/JobList';
import { db } from '../firebaseConfig'; // Import Firebase db
import { collection, getDocs } from 'firebase/firestore'; // Firestore functions

const JobSearch = () => {
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobs, setJobs] = useState([]); // To store fetched jobs
  const [loading, setLoading] = useState(true); // To manage loading state
  const [error, setError] = useState(null); // To handle errors

  // Open Modal
  const handleOpenModal = () => {
    setShowJobModal(true); // Set state to true to show the modal
  };

  // Fetch jobs from Firestore when the component mounts
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsCollection = collection(db, 'jobs'); // Reference to the 'jobs' collection
        const jobsSnapshot = await getDocs(jobsCollection); // Get documents from Firestore
        const jobsList = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Map docs to data
        setJobs(jobsList); // Set the fetched jobs to state
      } catch (error) {
        setError(error.message); // Set error if any
      } finally {
        setLoading(false); // Set loading to false after the fetch is complete
      }
    };

    fetchJobs();
  }, []); // Empty dependency array ensures the fetch only happens once, when the component mounts

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
          {/* Render JobList component and pass fetched jobs, loading, and error as props */}
          <JobList jobs={jobs} loading={loading} error={error} />
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
