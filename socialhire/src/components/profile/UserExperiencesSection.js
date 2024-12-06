import React from "react";
import { Card } from "react-bootstrap";
import "../../styles/UserExperiencesSection.css";

export const UserExperiencesSection = ({ experiences }) => {
  return (
    <div className="user-experiences-section">
      <h3 className="section-title">Experiences</h3>
      <div className="experiences-container">
        {experiences.length === 0 ? (
          <p className="no-experiences-message">No experiences added yet.</p>
        ) : (
          experiences.map((experience) => (
            <Card key={experience.id} className="experience-card shadow-sm">
              <Card.Body>
                <Card.Title className="experience-title">
                  {experience.title} at {experience.company}
                </Card.Title>
                <Card.Text className="experience-description">
                  {experience.description}
                </Card.Text>
                <Card.Text className="experience-dates">
                  {new Date(experience.startDate.seconds * 1000).toLocaleDateString()}{" "}
                  -{" "}
                  {experience.current
                    ? "Present"
                    : new Date(experience.endDate.seconds * 1000).toLocaleDateString()}
                </Card.Text>
              </Card.Body>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
