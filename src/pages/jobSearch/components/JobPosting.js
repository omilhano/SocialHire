import { React, useState } from 'react';
import { Heart, MessageCircle, Share2, Briefcase } from 'lucide-react';
import ApplyingJobModal from './ApplyJobModal';
import RecommendModal from './recommendModal/RecommendModal'; // Import RecommendModal component

// TODO EMBELEZAR POSTINGS
// FORMATAR FORMAL POSTS

const JobCard = ({ job }) => {
    const [showApplyingModal, setApplyingJobModal] = useState(false);
    const [showRecommendModal, setRecommendModal] = useState(false); // State for Recommend Modal

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = timestamp instanceof Date ? timestamp : timestamp.toDate();
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatDateTimeLocal = (inputDateTime) => {
        const date = new Date(inputDateTime);
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
        };
        return date.toLocaleString('en-US', options);
    };

    const formatPayRange = (min, max) => {
        return min && max ? `€${min} - €${max}` : "Pay range not available";
    };

    const formatHourlyRate = (pricePerHour) => {
        return pricePerHour ? `€${pricePerHour}/hour` : "Hourly rate not available";
    };

    const formatTimeDetails = (endTime, jobExpectedTime) => {
        return (
            <div className="text-sm text-gray-600">
                <p>End date: {formatDateTimeLocal(endTime)}</p>
                <p>Expected time: {jobExpectedTime || "Expected time not available"}</p>
            </div>
        );
    };

    const truncateText = (text, maxLength = 100) => {
        if (!text) return '';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    return (
        <div className="job-card border border-gray-300 rounded-lg shadow-md p-4 flex flex-col">
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

            <div className="job-content flex flex-col">
                <div className="job-header flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{job.jobTitle || 'Untitled Job'}</h3>
                    <div className="location-date-class">
                        <span id="location-post">{job.location}</span>
                        <span id="date-post">{formatDate(job.createdAt)}</span>
                    </div>

                </div>

                <div className="job-pay text-sm text-gray-600 mb-2">
                    {job.jobType === "Formal Job" && (
                        <>
                            <span className="pay-range">{formatPayRange(job.payRange?.min, job.payRange?.max)}</span>
                            <p className="job-description text-sm text-gray-700 mb-4">
                                {truncateText(job.jobDescription)}
                            </p>
                            <p className="job-additional-requirements text-sm text-gray-700 mb-4">
                                {truncateText(job.additionalJobRequirements)}
                            </p>
                            <p className="job-benefits text-sm text-gray-700 mb-4">
                                {truncateText(job.additionalBenefits)}
                            </p>
                            <p className="job-contract text-sm text-gray-700 mb-4">
                                {truncateText(job.contractDuration)}
                            </p>
                            <p className="job-favouredskills text-sm text-gray-700 mb-4">
                                {truncateText(job.favouredSkills)}
                            </p>
                        </>
                    )}

                    {job.jobType === "Hustler" && (
                        <>
                            <p className="job-description text-sm text-gray-700 mb-4">
                                {truncateText(job.jobDescription)}
                            </p>
                            <p className="hourly-rate">{formatHourlyRate(job.pricePerHour)}</p>
                            <p className="additional-requirements text-sm text-gray-500">
                                <strong>Additional Requirements: </strong>
                                {job.additionalRequirements && job.additionalRequirements.length > 0
                                    ? job.additionalRequirements.join(", ")
                                    : "No additional requirements"}
                            </p>
                            {formatTimeDetails(job.endTime, job.jobExpectedTime)}
                        </>
                    )}
                </div>

                <div className="job-footer flex justify-between items-center">
                    <div className="job-actions flex space-x-4">
                        <button className="applying-job" onClick={() => setApplyingJobModal(true)}>Apply</button>
                        <button className="recommend-job" onClick={() => setRecommendModal(true)}>Recommend</button>
                    </div>
                </div>
            </div>
            <ApplyingJobModal
                show={showApplyingModal}
                onClose={() => setApplyingJobModal(false)}
                jobId={job.id}
                jobTitle = {job.jobTitle}
                creatorId={job.userId}
            />
            <RecommendModal
                show={showRecommendModal}
                onClose={() => setRecommendModal(false)}
                jobId={job.id}
                creatorId={job.userID}
            />

        </div>
    );
};

export default JobCard;
