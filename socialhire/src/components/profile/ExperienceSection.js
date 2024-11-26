import { Plus, Briefcase, Calendar, PencilIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useFirebaseDocument } from '../../hooks/useFirebase';
import { auth } from "../../firebaseConfig";

export const ExperienceSection = ({
    experiences,
    newExperience,
    editMode,
    onEditModeChange,
    onExpereinceDataChange,
    onAddExperience,
}) => {
    const [selectedExperience, setSelectedExperience] = useState(null);

    const handleEditClick = (experience) => {
        setSelectedExperience(experience);
        onEditModeChange(true);
    };

    const handleCancel = () => {
        setSelectedExperience(null);
        onEditModeChange(false);
    };

    return (
        <div className="profile-section">
            <div className="section-header">
                <h2>Experience</h2>
                <button 
                    onClick={() => {
                        setSelectedExperience(null);
                        onEditModeChange(true);
                    }} 
                    className="add-btn"
                >
                    <Plus size={16} />
                    Add Experience
                </button>
            </div>

            {editMode && (
                <ExperienceForm
                    experience={selectedExperience || newExperience}
                    onExpereinceDataChange={onExpereinceDataChange}
                    onSave={(expData) => {
                        onAddExperience(expData);
                        setSelectedExperience(null);
                        onEditModeChange(false);
                    }}
                    onCancel={handleCancel}
                />
            )}

            <ExperienceList 
                experiences={experiences}
                onEdit={handleEditClick}
            />
        </div>
    );
};

const ExperienceForm = ({ experience, onSave, onCancel, onExpereinceDataChange }) => {
    const [formData, setFormData] = useState({ ...experience });
    const { updateDocument, addDocument, loading, error } = useFirebaseDocument('experiences');

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
        if (!auth.currentUser) return;
        if (onExpereinceDataChange) {
            Object.keys(formData).forEach((field) =>
                onExpereinceDataChange(field, formData[field])
            );
        }
        if (onSave) {
            const experienceData = {
                ...formData,
                userId: auth.currentUser.uid,
            };
            console.log("Experience data is on SAVE", experienceData); // Debug log
            console.log("Experience id ONSAVE", experienceData.id); // Debug log
        
            const docId = experienceData.id || `${auth.currentUser.uid}_${Date.now()}`;
            const success = experienceData.id
                ? true
                : true;

            console.log("Is it going to on save? ", (success && onSave)); // Debug log

            if (success && onSave) {
                onSave(experienceData);
                console.log("Is it going to on save? ", "Yes"); // Debug log
            }
            else console.log("Is it going to on save? ", "No"); // Debug log

        }
    };

    return (
        <div className="experience-form">
            <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Job Title"
                className="form-input"
            />
            <input
                type="text"
                value={formData.company || ""}
                onChange={(e) => handleInputChange("company", e.target.value)}
                placeholder="Company"
                className="form-input"
            />
            <div className="date-container">
                <input
                    type="date"
                    value={formData.startDate || ""}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                    className="form-input"
                />
                <input
                    type="date"
                    value={formData.endDate || ""}
                    onChange={(e) => handleInputChange("endDate", e.target.value)}
                    className="form-input"
                    disabled={formData.current}
                />
            </div>
            <label className="checkbox-label">
                <input
                    type="checkbox"
                    checked={formData.current || false}
                    onChange={(e) => handleInputChange("current", e.target.checked)}
                    className="checkbox-input"
                />
                <span>I currently work here</span>
            </label>
            <textarea
                value={formData.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Description"
                className="form-textarea"
            />
            <div className="form-actions">
                <button onClick={onCancel} className="cancel-button">Cancel</button>
                <button onClick={handleSave} disabled={loading} className="save-button">
                    {loading ? 'Saving...' : 'Save'}
                </button>
            </div>
            {error && <p className="error-text">{error}</p>}
        </div>
    );
};

const ExperienceList = ({ experiences, onEdit }) => {
    if (experiences.length === 0) {
        return <p className="empty-message">No experience added yet</p>;
    }

    return (
        <div className="experience-list">
            {experiences.map((exp) => (
                <div key={exp.id} className="experience-card">
                    <div className="card-header">
                        <div className="icon-container">
                            <Briefcase className="icon" />
                        </div>
                        <div className="header-content">
                            <div className="title-row">
                                <h3 className="title">{exp.title}</h3>
                                <button 
                                    onClick={() => onEdit(exp)} 
                                    className="edit-button"
                                >
                                    <PencilIcon className="edit-icon" />
                                </button>
                            </div>
                            <p className="company">{exp.company}</p>
                            <div className="date-info">
                                <Calendar className="calendar-icon" />
                                <span>{exp.startDate} - {exp.current ? "Present" : exp.endDate}</span>
                            </div>
                            <p className="description">{exp.description}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};