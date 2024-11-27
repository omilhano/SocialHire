import React, { useState } from 'react';
import { Pencil, MapPin } from 'lucide-react';
import DefaultProfilePic from '../../images/placeholderPic.jpg';

export const ProfileHeader = ({
    profileData,
    editMode,
    onEditModeChange,
    onProfilePictureChange,
    onProfileDataChange
}) => (
    <div className="profile-header">
        <div className="profile-cover" />
        <div className="profile-picture-container">
            <img
                src={profileData.profilePicture || DefaultProfilePic}
                alt="Profile"
                className="profile-image"
            />
            <label className="profile-picture-upload">
                <input
                    type="file"
                    accept="image/*"
                    onChange={onProfilePictureChange}
                    className="hidden"
                />
                <Pencil className="edit-icon" size={16} />
            </label>
        </div>


        <div className="basic-info">
            {editMode.basic ? (
                <BasicInfoForm
                    profileData={profileData}
                    onProfileDataChange={onProfileDataChange}
                    onSave={() => onEditModeChange({ basic: false })}
                    onCancel={() => onEditModeChange({ basic: false })}
                />
            ) : (
                <BasicInfoDisplay
                    profileData={profileData}
                    onEdit={() => onEditModeChange({ basic: true })}
                />
            )}
        </div>
    </div>
);

// BasicInfoForm.js
const BasicInfoForm = ({ profileData, onProfileDataChange, onSave, onCancel }) => {
    const [formData, setFormData] = useState({ ...profileData });
    console.log("Profile", profileData); // Debug log

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            [field]: value,
        }));
    };

    const handleSave = () => {
        console.log("Handle save function:" )
        if (onProfileDataChange) {
            Object.keys(formData).forEach((field) =>
            onProfileDataChange(field, formData[field])
            );
        }
        if (onSave) {
            onSave();
        }
    };

    const handleCancel = () => {
        setFormData({ ...profileData }); // Reset formData to original data
        if (onCancel) {
            onCancel();
        }
    };

    return (
        <div className="edit-basic-info">
            <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="First Name"
                className="edit-input"
            />
            <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Last Name"
                className="edit-input"
            />
            <input
                type="text"
                value={formData.headline}
                onChange={(e) => handleInputChange('headline', e.target.value)}
                placeholder="Headline"
                className="edit-input"
            />
            <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Location"
                className="edit-input"
            />
            <div className="edit-actions">
                <button onClick={handleSave} className="save-btn">Save</button>
                <button onClick={handleCancel} className="cancel-btn">Cancel</button>
            </div>
        </div>
    );
};

// BasicInfoDisplay.js
const BasicInfoDisplay = ({ profileData, onEdit }) => (
    
    <div className="info-display">
        <h1>{profileData.firstName} {profileData.lastName}</h1>
        <p className="headline">{profileData.headline}</p>
        <p className="location">
            <MapPin size={16} />
            {profileData.location}
        </p>
        <button onClick={onEdit} className="edit-btn">
            <Pencil size={16} />
            Edit Basic Info
        </button>
    </div>
);