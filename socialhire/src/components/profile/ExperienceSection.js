import React from 'react';
import { Plus, Briefcase, Calendar } from 'lucide-react';
import DefaultProfilePic from '../../images/profile_rand.png';
import { ExperienceForm, ExperienceList } from './ExperienceComponents';


export const ExperienceSection = ({
    experience,
    newExperience,
    editMode,
    onEditModeChange,
    onNewExperienceChange,
    onAddExperience
}) => (
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
                onChange={onNewExperienceChange}
                onSave={onAddExperience}
                onCancel={() => onEditModeChange(false)}
            />
        )}

        <ExperienceList items={experience} />
    </div>
);