import { Briefcase, Calendar } from 'lucide-react';
import React, { useState, useEffect} from 'react';

const ExperienceForm = ({ experience, onChange, onSave, onCancel }) => {
    const handleChange = (field, value) => {
      onChange({ ...experience, [field]: value });
    };
  
    return (
      <div className="experience-form">
        <input
          type="text"
          value={experience.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Job Title"
          className="input-field"
        />
        <input
          type="text"
          value={experience.company || ""}
          onChange={(e) => handleChange("company", e.target.value)}
          placeholder="Company"
          className="input-field"
        />
        <div className="date-inputs">
          <input
            type="date"
            value={experience.startDate || ""}
            onChange={(e) => handleChange("startDate", e.target.value)}
            className="input-field"
          />
          <input
            type="date"
            value={experience.endDate || ""}
            onChange={(e) => handleChange("endDate", e.target.value)}
            className="input-field"
            disabled={experience.current}
          />
        </div>
        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={experience.current || false}
            onChange={(e) => handleChange("current", e.target.checked)}
          />
          I currently work here
        </label>
        <textarea
          value={experience.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Description"
          className="textarea-field"
        />
        <div className="form-actions">
          <button onClick={onSave} className="save-button">
            Save
          </button>
          <button onClick={onCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      </div>
    );
  };
  
  const ExperienceList = ({ userId }) => {
    const [experiences, setExperiences] = useState([]);
  
    useEffect(() => {
      // Fetch experiences for the given userId
      const fetchExperiences = async () => {
        try {
          const response = await fetch(`/api/experiences?userId=${userId}`);
          const data = await response.json();
          setExperiences(data);
        } catch (error) {
          console.error("Error fetching experiences:", error);
        }
      };
  
      fetchExperiences();
    }, [userId]);
  
    return (
      <div className="experience-list">
        {experiences.map((exp, index) => (
          <div key={index} className="experience-item">
            <div className="experience-header">
              <Briefcase className="icon" />
              <div>
                <h3 className="title">{exp.title}</h3>
                <p className="company">{exp.company}</p>
              </div>
            </div>
            <div className="experience-details">
              <p className="date">
                <Calendar className="icon-small" />
                {exp.startDate} - {exp.current ? "Present" : exp.endDate}
              </p>
              <p className="description">{exp.description}</p>
            </div>
          </div>
        ))}
        {experiences.length === 0 && (
          <p className="empty-message">No experience added yet</p>
        )}
      </div>
    );
  };
  
  export { ExperienceForm, ExperienceList };