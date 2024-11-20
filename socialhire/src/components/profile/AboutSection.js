import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import DefaultProfilePic from '../../images/profile_rand.png';

export const AboutSection = ({ about, editMode, onEditModeChange, onSave }) => {
    const [tempAbout, setTempAbout] = useState(about);

    const handleSave = () => {
        if (onSave) {
            onSave(tempAbout); // Pass the updated value to the parent
        }
        onEditModeChange(false); // Exit edit mode
    };

    const handleCancel = () => {
        setTempAbout(about); // Reset to the original value
        onEditModeChange(false); // Exit edit mode
    };

    return (
        <div className="profile-section">
            <h2>About</h2>
            {editMode ? (
                <div className="edit-about">
                    <textarea
                        value={tempAbout}
                        onChange={(e) => setTempAbout(e.target.value)} // Update local state
                        className="edit-textarea"
                    />
                    <div className="edit-actions">
                        <button onClick={handleSave} className="save-btn">
                            Save
                        </button>
                        <button onClick={handleCancel} className="cancel-btn">
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="about-content">
                    <p>{about}</p>
                    <button onClick={() => onEditModeChange(true)} className="edit-btn">
                        <Pencil size={16} />
                        Edit About
                    </button>
                </div>
            )}
        </div>
    );
};
