import React from "react";
import { Card, Button } from "react-bootstrap";
import "../../styles/JobPostsSection.css";

/**
 * JobPostsSection Component
 * 
 * Parameters:
 * - jobs (Array): An array of job objects. Each job contains details such as jobTitle, 
 *   jobType, location, pricePerHour, jobDescription, jobExpectedTime, and endTime.
 * - editMode (Boolean): A flag that determines whether the component is in edit mode. 
 *   If true, it displays a "Delete Job" button for each job listing.
 * - onDeleteJob (Function): A callback function to handle the deletion of a job listing. 
 *   It is triggered when the "Delete Job" button is clicked, and it takes the job's jobID as an argument.
 * 
 * Description:
 * This component renders a list of job postings. If no jobs are available, 
 * it shows a message indicating no job listings yet. 
 * Each job is displayed in a Bootstrap Card with details such as title, type, location, hourly rate, description, 
 * expected time, and end time. If the component is in edit mode, a delete button will appear on each job card.
 */
export const JobPostsSection = ({ jobs, editMode, onDeleteJob }) => {
  return (
    <div className="job-posts-section">
      <h3 className="section-title">Job Listings</h3>
      <div className="jobs-container">
        {jobs.length === 0 ? (
          <p className="no-jobs-message">No job listings yet.</p>
        ) : (
          jobs.map((job) => (
            <Card key={job.jobID} className="job-card shadow-sm">
              <Card.Body>
                <Card.Title className="job-title">{job.jobTitle}</Card.Title>
                <Card.Subtitle className="job-type text-muted mb-2">
                  Type: {job.jobType}
                </Card.Subtitle>
                <Card.Text className="job-location">
                  <strong>Location:</strong> {job.location}
                </Card.Text>
                <Card.Text className="job-price">
                  <strong>Price per hour:</strong> {job.pricePerHour || "N/A"}
                </Card.Text>
                <Card.Text className="job-description">
                  <strong>Description:</strong> {job.jobDescription}
                </Card.Text>
                <Card.Text className="job-details">
                  <strong>Expected Time:</strong> {job.jobExpectedTime} |{" "}
                  <strong>End Time:</strong> {job.endTime}
                </Card.Text>
              </Card.Body>
              {editMode && (
                <Card.Footer>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDeleteJob(job.jobID)}
                  >
                    Delete Job
                  </Button>
                </Card.Footer>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
