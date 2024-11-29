import React from 'react';
import { Heart, MessageCircle, Share2, Briefcase } from 'lucide-react';

// Individual JobCard Component
const JobCard = ({ job }) => {
    // Format the date to a readable string

    // Format pay range (min and max) from firestore
    const formatPayRange = (min, max) => {
        return min && max ? `$${min} - $${max}` : "Pay range not available";
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A'; // Return "N/A" if no date

        const date = timestamp instanceof Date ? timestamp : timestamp.toDate();
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Truncate the description text to a maximum length with ellipsis
    const truncateText = (text, maxLength = 100) => {
        if (!text) return '';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    return (
        <div className="job-card border border-gray-300 rounded-lg shadow-md p-4 flex flex-col">
            {/* Job Image or Placeholder */}
            <div className="job-image-container mb-4 flex justify-center">
                {job.imageUrl ? (
                    <img
                        src={job.imageUrl}
                        alt="Job"
                        className="job-image w-full h-48 object-cover rounded-md"
                    />
                ) : (
                    <div className="placeholder-icon flex items-center justify-center w-full h-48 bg-gray-200 rounded-md">
                        <Briefcase size={48} className="text-gray-500" />
                    </div>
                )}
            </div>

            {/* Job Content */}
            <div className="job-content flex flex-col">
                {/* Job Header: Title and Date */}
                <div className="job-header flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{job.jobTitle || 'Untitled Job'}</h3>
                    <span id="location-post" className="text-sm text-gray-500">{(job.location)}</span>
                    <span id="date-post" className="text-sm text-gray-500">{formatDate(job.createdAt)}</span>
                </div>

                {/* Job Description */}
                {/* Job pay range */}
                <span className='pay-range'>{formatPayRange(job.payRange?.min, job.payRange?.max)}</span>
                <p className="job-description text-sm text-gray-700 mb-4">
                    {truncateText(job.description)}
                </p>

                {/* Footer with Action Buttons */}
                <div className="job-footer flex justify-between items-center">
                    <div className="job-actions flex space-x-4">
                        <button className="action-button flex items-center text-gray-500 hover:text-gray-700">
                            <Share2 size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobCard;
