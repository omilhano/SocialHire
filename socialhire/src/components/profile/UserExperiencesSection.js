import React from "react";
import { Card } from "react-bootstrap";
import "../../styles/UserExperiencesSection.css";

/**
 * UserExperiencesSection Component
 * 
 * This component displays a list of user experiences, such as job or internship roles.
 * It uses a Bootstrap card for each experience to display its title, description, and dates.
 * If no experiences are provided, it shows a message indicating no experiences have been added yet.
 * 
 * Parameters:
 * - experiences (Array): An array of experience objects, where each object contains details such as:
 *    - id (String): Unique identifier for the experience
 *    - title (String): The title of the position or role
 *    - company (String): The company or organization where the experience took place
 *    - description (String): A description of the responsibilities or tasks performed
 *    - startDate (Date): The starting date of the experience (in Firestore timestamp format)
 *    - endDate (Date): The ending date of the experience (in Firestore timestamp format)
 *    - current (Boolean): A flag indicating if the experience is ongoing (i.e., present)
 * 
 * Description:
 * - This component maps through the experiences array and renders each experience inside a Bootstrap card.
 * - If no experiences are available, a "No experiences added yet" message is displayed.
 */

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
