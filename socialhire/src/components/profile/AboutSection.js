
import React from 'react';
import { Pencil, MapPin } from 'lucide-react';
import DefaultProfilePic from '../../images/profile_rand.png';

export const AboutSection = ({ about, editMode, onEditModeChange, onSave }) => (
    <div className="profile-section">
        <h2>About</h2>
        {editMode ? (
            <div className="edit-about">
                <textarea
                    value={about}
                    onChange={(e) => onSave(e.target.value)}
                    className="edit-textarea"
                />
                <div className="edit-actions">
                    <button onClick={() => onEditModeChange(false)} className="save-btn">
                        Save
                    </button>
                    <button onClick={() => onEditModeChange(false)} className="cancel-btn">
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
