import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const JobDetailPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const job = location.state?.job; // Access the passed job data

    if (!job) {
        return <div>No job details available. Please navigate back to the listings page.</div>;
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