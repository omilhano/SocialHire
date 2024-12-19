import { Plus, Briefcase, Calendar, PencilIcon, TrashIcon, FolderIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useFirebaseDocument } from 'hooks/useFirebase';
import { auth } from "firebaseConfig";
import PropTypes from 'prop-types';

/**
 * ExperienceSection Component
 * 
 * Parameters:
 * - experiences (Array): The list of experience objects to display. 
 *   Each experience contains fields like `id`, `title`, `company`, `startDate`, `endDate`, `current`, and `description`.
 * - newExperience (Object): Data for a new experience to be added (not used directly in the component).
 * - editMode (Boolean): A flag that determines whether the component is in edit mode. If true, it shows a form to add or edit an experience.
 * - onEditModeChange (Function): A callback function to handle toggling between edit and view mode. 
 *   It takes a boolean value (true/false) as an argument. True Edit, False no Edit
 * - onExpereinceDataChange (Function): A callback function that handles changes in experience data in the form.
 * - onAddExperience (Function): A callback function to add a new experience to the list. It receives the experience data as an argument.
 * - onDeleteExperience (Function): A callback function to delete an experience. It receives the experience id to delete.
 * 
 * Description:
 * This component manages the rendering and editing of a user's experience list. 
 * It provides functionality to view existing experiences, add new ones, and edit or delete existing experiences. 
 */

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
                    experience={selectedExperience || {}}
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

// ExperienceForm Component
const ExperienceForm = ({ experience, onSave, onCancel }) => {
    const [formData, setFormData] = useState(() => ({
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        ...experience, // Override with provided experience data if it exists
    }));

    const { loading, error } = useFirebaseDocument('experience');
    useEffect(() => {
        setFormData({
            title: '',
            company: '',
            startDate: '',
            endDate: '',
            current: false,
            description: '',
            ...experience, // Use experience data if available
        });
    }, [experience]);

    useEffect(() => {
        setFormData({
            ...experience,
            startDate: experience.startDate instanceof Date
                ? experience.startDate.toISOString().split('T')[0]
                : '',
            endDate: experience.endDate instanceof Date
                ? experience.endDate.toISOString().split('T')[0]
                : ''
        });
    }, [experience]);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        if (!auth.currentUser) return;

        const experienceData = {
            title: formData.title || '',
            company: formData.company || '',
            startDate: formData.startDate ? new Date(formData.startDate) : null,
            endDate: formData.endDate ? new Date(formData.endDate) : null,
            current: formData.current || false,
            description: formData.description || '',
            userId: auth.currentUser.uid,
            id: formData.id || ''
        };
        console.log("Expirience Data in Handle Save: ", experienceData)
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

// ExperienceList Component
const ExperienceList = ({ experiences, onEdit, onDelete }) => {
    const { deleteDocument } = useFirebaseDocument('experience');

    const formatDate = (date) => {
        if (!date) return 'N/A';

        try {
            // Handle Firebase Timestamp
            if (date?.seconds) {
                return new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'long'
                }).format(new Date(date.seconds * 1000));
            }

            // Handle Date object
            if (date instanceof Date) {
                return new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'long'
                }).format(date);
            }

            // Handle string date
            const parsedDate = new Date(date);
            if (!isNaN(parsedDate.getTime())) {
                return new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'long'
                }).format(parsedDate);
            }

            return 'Invalid Date';
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

    if (!Array.isArray(experiences) || experiences.length === 0) {
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