import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Fetch job by ID from Firestore
const fetchJobById = async (jobId) => {
    const db = getFirestore();

    try {
        // Reference to the job document in the "jobs" collection
        const jobRef = doc(db, 'jobs', jobId);
        const jobSnapshot = await getDoc(jobRef);

        if (jobSnapshot.exists()) {
            return jobSnapshot.data();
        } else {
            console.log('No such job!');
            return null;
        }
    } catch (error) {
        console.error("Error fetching job:", error);
        return null;
    }
};

const JobDetailPage = () => {
    const { jobId } = useParams(); // Get jobId from URL parameters
    const navigate = useNavigate();
    const [job, setJob] = useState(null);

    useEffect(() => {
        // Fetch job details using the jobId from the URL
        const getJobDetails = async () => {
            const jobData = await fetchJobById(jobId);
            setJob(jobData);
        };

        getJobDetails();
    }, [jobId]); // Dependency array ensures this runs when jobId changes

    if (!job) {
        return <div>Loading job details...</div>;
    }

    const formatPayRange = (min, max) => {
        return min && max ? `€${min} - €${max}` : "Pay range not available";
    };

    const formatHourlyRate = (pricePerHour) => {
        return pricePerHour ? `€${pricePerHour}/hour` : "Hourly rate not available";
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';

        // Check if it's a Date object
        if (timestamp instanceof Date) {
            return timestamp.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        }

        // Check if it's a Firebase Timestamp (has seconds and nanoseconds)
        if (timestamp.seconds && timestamp.nanoseconds) {
            const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        }

        // Assume it's a string or number that can be converted to a Date
        const date = new Date(timestamp);
        if (!isNaN(date)) {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        }

        // If all else fails, return 'Invalid Date'
        return 'Invalid Date';
    };

    return (
        <div className="job-detail-page">
            <h1>{job.jobTitle}</h1>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Posted On:</strong> {formatDate(job.createdAt)}</p>
            <p><strong>Description:</strong> {job.jobDescription}</p>

            {job.jobType === "Formal Job" && (
                <>
                    <p><strong>Pay Range:</strong> {formatPayRange(job.payRange?.min, job.payRange?.max)}</p>
                    <p><strong>Additional Requirements:</strong> {job.additionalJobRequirements}</p>
                    <p><strong>Additional Benefits:</strong> {job.additionalBenefits}</p>
                    <p><strong>Contract Duration:</strong> {job.contractDuration}</p>
                    <p><strong>Favoured Skills:</strong> {job.favouredSkills}</p>
                </>
            )}

            {job.jobType === "Hustler" && (
                <>
                    <p><strong>Hourly Rate:</strong> {formatHourlyRate(job.pricePerHour)}</p>
                    <p><strong>Expected Time:</strong> {job.jobExpectedTime || "Not available"}</p>
                    <p><strong>End Time:</strong> {formatDate(job.endTime)}</p>
                    <p><strong>Additional Requirements:</strong> {job.additionalRequirements?.join(", ") || "None"}</p>
                </>
            )}

            <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
    );
};

export default JobDetailPage;
