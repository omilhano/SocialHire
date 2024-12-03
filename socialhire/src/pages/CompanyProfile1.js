import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CompanyProfile.css';

const CompanyProfile = () => {
    const navigate = useNavigate();
    const [state, setState] = useState({
        companyData: {},
        jobPostings: [],
        loading: false,
        error: null,
        editMode: { basic: false, biography: false }
    });

    const { companyData, jobPostings, loading, error, editMode } = state;

    useEffect(() => {
        // Placeholder: You can add mock data here if needed for testing
        setState(prev => ({
            ...prev,
            loading: false
        }));
    }, []);

    if (loading) {
        return <div className="loading">Loading company profile...</div>;
    }

    return (
        <div className="company-profile-container">
            {error && (
                <div className="error-toast">
                    {error}
                    {/* You can implement close functionality if needed */}
                </div>
            )}

            {/* Profile Header Section (Basic Info) */}
            <div className="profile-header">
                <h1>{companyData.name || "Company Name"}</h1>
                <p>{companyData.email || "company@example.com"}</p>
                <button className="edit-button">
                    Edit Profile
                </button>
                {/* Placeholder for logo */}
                <div className="logo-placeholder">
                    <span>Logo Placeholder</span>
                </div>
            </div>

            {/* Biography Section */}
            <div className="biography-section">
                <h2>Biography</h2>
                <p>{companyData.bio || "Company biography goes here."}</p>
                <button className="edit-button">
                    Edit Biography
                </button>
            </div>

            {/* Job Postings Section */}
            <div className="job-postings-section">
                <h2>Job Postings</h2>
                {jobPostings.length === 0 ? (
                    <p>No job postings available.</p>
                ) : (
                    <ul>
                        {jobPostings.map((job, index) => (
                            <li key={index}>{job.title}</li>
                        ))}
                    </ul>
                )}
                <button className="edit-button">
                    Add Job Posting
                </button>
            </div>

            {/* Logout Button */}
            <button className="logout" onClick={() => navigate('/signin')}>
                Logout
            </button>
        </div>
    );
};

export default CompanyProfile;
