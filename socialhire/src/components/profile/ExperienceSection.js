import { Plus, Briefcase, Calendar } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useFirebaseDocument } from '../../hooks/useFirebase'; // Custom hook import
import { auth } from "../../firebaseConfig";

export const ExperienceSection = ({
    experience,
    newExperience,
    editMode,
    onEditModeChange,
    onExperienceDataChange,
    userId,
    onAddExperience,
}) => {
    return (
        <div className="profile-section">
            <div className="section-header">
                <h2>Experience</h2>
                <button onClick={() => onEditModeChange(true)} className="add-btn">
                    <Plus size={16} />
                    Add Experience
                </button>
            </div>

            {editMode && (
                <ExperienceForm
                    experience={newExperience}
                    onExperienceDataChange={onExperienceDataChange}
                    onSave={() => onEditModeChange(false)}
                    onCancel={() => onEditModeChange(false)}
                    userId={userId}
                />
            )}

            <ExperienceList userId={userId} />
        </div>
    );
};

const ExperienceForm = ({ experience, onExperienceDataChange, onSave, onCancel, userId }) => {
    const [formData, setFormData] = useState({ ...experience });
    const { updateDocument, loading, error } = useFirebaseDocument('experiences'); // Using custom hook

    useEffect(() => {
        setFormData({ ...experience });
    }, [experience]);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        if (!userId) return;

        const experienceData = {
            ...formData,
            userId,
        };

        const docId = experienceData.id || `${userId}_${Date.now()}`; // Creating a unique ID if new
        const success = await updateDocument(docId, experienceData);

        if (success && onExperienceDataChange) {
            onExperienceDataChange(experienceData);
            if (onSave) onSave();
        }
    };

    const handleCancel = () => {
        setFormData({ ...experience });
        if (onCancel) {
            onCancel();
        }
    };

    return (
        <div className="experience-form">
            <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Job Title"
                className="input-field"
            />
            <input
                type="text"
                value={formData.company || ""}
                onChange={(e) => handleInputChange("company", e.target.value)}
                placeholder="Company"
                className="input-field"
            />
            <div className="date-inputs">
                <input
                    type="date"
                    value={formData.startDate || ""}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                    className="input-field"
                />
                <input
                    type="date"
                    value={formData.endDate || ""}
                    onChange={(e) => handleInputChange("endDate", e.target.value)}
                    className="input-field"
                    disabled={formData.current}
                />
            </div>
            <label className="checkbox-field">
                <input
                    type="checkbox"
                    checked={formData.current || false}
                    onChange={(e) => handleInputChange("current", e.target.checked)}
                />
                I currently work here
            </label>
            <textarea
                value={formData.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Description"
                className="textarea-field"
            />
            <div className="form-actions">
                <button onClick={handleSave} className="save-btn" disabled={loading}>Save</button>
                <button onClick={handleCancel} className="cancel-btn">Cancel</button>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

const ExperienceList = ({ userId }) => {
    const [experiences, setExperiences] = useState([]);
    const [error, setError] = useState(null);
    const { getDocument } = useFirebaseDocument('experiences');

    useEffect(() => {
        const fetchExperiences = async () => {
            if (!userId) return;

            try {
                const experienceData = await getDocument(userId);
                if (experienceData) {
                    setExperiences(experienceData.experiences || []);
                }
            } catch (err) {
                console.error("Error fetching experiences:", err);
                setError('Failed to fetch experiences. Please try again.');
            }
        };

        fetchExperiences();
    }, [userId, getDocument]);

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div className="experience-list">
            {experiences.map((exp) => (
                <div key={exp.id} className="experience-item">
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
