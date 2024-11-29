import React from 'react';
import JobCard from './JobPosting'; // Import JobCard component
import { Heart, MessageCircle, Share2, Briefcase } from 'lucide-react';

// JobList Component with horizontal scroll
const JobList = ({ jobs, loading, error }) => {
    // Show loading state
    if (loading) {
        return (
            <div className="w-full h-64 flex items-center justify-center">
                <div className="text-gray-500">Loading jobs...</div>
            </div>
        );
    }

    // Show error message if any error occurs while fetching data
    if (error) {
        return (
            <div className="w-full h-64 flex items-center justify-center text-red-500">
                <div>{error}</div>
            </div>
        );
    }

    // Handle empty jobs list
    if (!jobs?.length) {
        return (
            <div className="w-full h-64 flex flex-col items-center justify-center text-gray-500">
                <Briefcase size={32} />
                <p className="mt-2">No jobs posted yet</p>
            </div>
        );
    }

    // Render the list of job postings
    return (
        <div className="jobs-scroll">
            <div className="flex space-x-4 px-4 overflow-x-auto">
                {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>
        </div>
    );
};

export default JobList;
