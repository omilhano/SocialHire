import { Plus, Briefcase, Calendar, PencilIcon, TrashIcon, FolderIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useFirebaseDocument } from '../../hooks/useFirebase';
import { auth } from "../../firebaseConfig";
import PropTypes from 'prop-types';

export const ExperienceSection = ({
    experiences: initialExperiences,
    newExperience,
    editMode,
    onEditModeChange,
    onExpereinceDataChange,
    onAddExperience,
    onDeleteExperience
}) => {
    const [selectedExperience, setSelectedExperience] = useState(null);
    const [localExperiences, setLocalExperiences] = useState(initialExperiences);
    useEffect(() => {
        // Keep local state in sync with parent prop changes
        setLocalExperiences(initialExperiences);
    }, [initialExperiences]);

    const handleEditClick = (experience) => {
        setSelectedExperience(experience);
        onEditModeChange(true);
    };

    const handleCancel = () => {
        setSelectedExperience(null);
        onEditModeChange(false);
    };

    const handleDeleteExperience = (experienceId) => {
        // Update local state to remove the deleted experience
        setLocalExperiences((prevExperiences) =>
            prevExperiences.filter((exp) => exp.id !== experienceId)
        );
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
                experiences={localExperiences}
                onEdit={handleEditClick}
                onDelete={handleDeleteExperience}
            />
        </div>
    );
};

const ExperienceForm = ({ experience = {}, onSave, onCancel, onExpereinceDataChange }) => {
    const [formData, setFormData] = useState(() => ({
        ...experience,
        startDate: experience.startDate || '',
        endDate: experience.endDate || ''
    }));
    const { updateDocument, addDocument, loading, error } = useFirebaseDocument('experiences');

    useEffect(() => {
        setFormData({
            ...experience,
            startDate: experience.startDate || '',
            endDate: experience.endDate || ''
        });
    }, [experience]);

    const handleInputChange = (field, value) => {
        if (field === 'startDate' || field === 'endDate') {
            setFormData((prev) => ({
                ...prev,
                [field]: value
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [field]: value,
            }));
        }
    };

    const handleSave = async () => {
        if (!auth.currentUser) return;
    
        const experienceData = {
            title: formData.title || '',
            company: formData.company || '',
            startDate: formData.startDate ? new Date(formData.startDate) : null, // Convert to Date
            endDate: formData.endDate ? new Date(formData.endDate) : null,       // Convert to Date
            current: formData.current || false,
            description: formData.description || '',
            userId: auth.currentUser.uid,
            id: formData.id || `${auth.currentUser.uid}_${Date.now()}`
        };
    
        try {
            if (onSave) {
                onSave(experienceData);
            }
        } catch (error) {
            console.error("Error saving experience:", error);
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

const ExperienceList = ({ experiences, onEdit, onDelete }) => {
    const { deleteDocument } = useFirebaseDocument('experience');

    const formatDate = (date) => {
        if (!date) return 'N/A';

        try {
            // Handle Firebase Timestamp
            if (date.seconds) {
                date = new Date(date.seconds * 1000);
            }
            // Handle Date object or string
            else if (!(date instanceof Date)) {
                date = new Date(date);
            }

            if (isNaN(date.getTime())) {
                return 'Invalid Date';
            }

            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long'
            }).format(date);
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'N/A';
        }
    };

    const handleDelete = async (exp) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete the experience "${exp.title}"?`);

        if (confirmDelete) {
            const result = await deleteDocument('experience', exp.id);

            if (result.success) {
                console.log("Experience deleted successfully");
                if (onDelete) {
                    onDelete(exp.id);
                }
            } else {
                console.error("Error deleting document:", result.error);
                alert("Failed to delete experience. Please try again.");
            }
        }
    };

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
                                <h3 className="title">{exp.title || 'No Title'}</h3>
                                <button
                                    onClick={() => onEdit(exp)}
                                    className="edit-button"
                                >
                                    <PencilIcon className="edit-icon" />
                                </button>
                                <button
                                    onClick={() => handleDelete(exp)}
                                    className="delete-button"
                                >
                                    <TrashIcon className="delete-icon" />
                                </button>
                            </div>
                            <p className="company">{exp.company || 'No Company Listed'}</p>
                            <div className="date-info">
                                <Calendar className="calendar-icon" />
                                <span>
                                    {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                                </span>
                            </div>
                            <p className="description">{exp.description || 'No description provided'}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};