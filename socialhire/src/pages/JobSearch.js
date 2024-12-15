import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import Precautions from '../components/Precautions';
import CreatingJobModal from '../components/CreatingJobModal';
import JobList from '../components/JobList';
import { db } from '../firebaseConfig'; // Import Firebase db
import { collection, getDocs, query, where } from 'firebase/firestore'; // Firestore functions
import '../styles/JobSearch.css';

const JobSearch = ({ filters }) => {
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobs, setJobs] = useState([]); // To store fetched jobs
  const [loading, setLoading] = useState(true); // To manage loading state
  const [error, setError] = useState(null); // To handle errors

  // Open Modal
  const handleOpenModal = () => {
    setShowJobModal(true); // Set state to true to show the modal
  };

  // Fetch jobs from Firestore when the component mounts or filters change
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        console.log(filters); // Debug check filters being passed
        setLoading(true); // Start loading
        let jobsCollectionRef = collection(db, 'jobs'); // Reference to the 'jobs' collection

        // Only apply filters if one chosen
        // to prevent e.g Selecting "Job Type" and no other filter would present no jobs given that the
        // queries would assume the placeholder values
        if (filters.jobType && filters.jobType !== 'Choose Type of Job') {
          jobsCollectionRef = query(jobsCollectionRef, where('jobType', '==', filters.jobType));
        }
        if (filters.location && filters.location !== 'Choose Location') {
          jobsCollectionRef = query(jobsCollectionRef, where('location', '==', filters.location));
        }
        // Add the userType filter if selected
        if (filters.userType && filters.userType !== 'Choose User Type') {
          jobsCollectionRef = query(jobsCollectionRef, where('userType', '==', filters.userType));
        }

        // Handle salary range filter if min/max salary are set
        if (filters.minSalary || filters.maxSalary) {
          const jobsSnapshot = await getDocs(jobsCollectionRef); // Get documents from Firestore
          const jobsList = jobsSnapshot.docs
            .map(doc => {
              const data = doc.data();
              const payRange = data.payRange || {};
              return { id: doc.id, ...data, userId:data.userId, payRange };
            })
            .filter(job => {
              // Queries jobs minimum and maximum salary ranged defined before
              const { min, max } = job.payRange;
              const jobMinSalary = parseInt(min);
              const jobMaxSalary = parseInt(max);

              // Apply filters for salary range
              const minSalaryMatch = filters.minSalary ? jobMinSalary >= filters.minSalary : true;
              const maxSalaryMatch = filters.maxSalary ? jobMaxSalary <= filters.maxSalary : true;

              return minSalaryMatch && maxSalaryMatch;
            });
          setJobs(jobsList); // Set the fetched jobs to state
        } else {
          // No salary filter, just apply other filters
          const jobsSnapshot = await getDocs(jobsCollectionRef); // Get documents from Firestore
          const jobsList = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          // Additional check for pricePerHour if jobType is 'Hustler'
          if (filters.jobType === 'Hustler' && filters.pricePerHour) {
            const filteredJobs = jobsList.filter(job => {
              const jobPrice = job.pricePerHour || 0; // Default to 0 if pricePerHour is not set
              return jobPrice >= filters.pricePerHour;
            });
            setJobs(filteredJobs); // Filter jobs based on pricePerHour
          } else {
            setJobs(jobsList); // Set the fetched jobs to state
          }
        }
      } catch (error) {
        setError(error.message); // Set error if any
      } finally {
        setLoading(false); // Set loading to false after the fetch is complete
      }
    };

    fetchJobs(); // Call the fetchJobs function
  }, [filters]); // Re-run the effect whenever filters change

  return (
    <Container fluid id="background-main-page" className="g-0">
      <div className="grid-layout">
        {/* Sidebar */}
        <div className="layout-sidebar">
          <div className="sidebar-header">
              {/* Button to open the modal */}
              <button onClick={handleOpenModal} className='btn btn-primary'>Start Hiring</button>
              <Button variant="info">Check applications</Button>
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
            {/* Component to suggest precautions before accepting jobs */}
            <Precautions />
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
