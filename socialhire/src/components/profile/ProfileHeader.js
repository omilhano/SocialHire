import React from 'react';
import { Pencil, MapPin } from 'lucide-react';
import DefaultProfilePic from '../../images/placeholderPic.jpg';

export const ProfileHeader = ({ 
    profileData, 
    editMode, 
    onEditModeChange, 
    onProfilePictureChange, 
    onProfileDataChange,
    onSaveBasicInfo 
}) => (
    <div className="profile-header">
        <div className="profile-cover" />
        <div className="profile-picture-container">
            <div className="profile-picture">
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
        </div>

        <div className="basic-info">
            {editMode.basic ? (
                <BasicInfoForm 
                    profileData={profileData}
                    onProfileDataChange={onProfileDataChange}
                    onSave={onSaveBasicInfo}
                    onCancel={() => onEditModeChange(prev => ({ ...prev, basic: false }))}
                />
            ) : (
                <BasicInfoDisplay 
                    profileData={profileData}
                    onEdit={() => onEditModeChange(prev => ({ ...prev, basic: true }))}
                />
            )}
        </div>
    </div>
);

// BasicInfoForm.js
const BasicInfoForm = ({ profileData, onProfileDataChange, onSave, onCancel }) => (
    <div className="edit-basic-info">
        <input
            type="text"
            value={profileData.firstName}
            onChange={(e) => onProfileDataChange(prev => ({
                ...prev,
                firstName: e.target.value
            }))}
            placeholder="First Name"
            className="edit-input"
        />
        <input
            type="text"
            value={profileData.lastName}
            onChange={(e) => onProfileDataChange(prev => ({
                ...prev,
                lastName: e.target.value
            }))}
            placeholder="Last Name"
            className="edit-input"
        />
        <input
            type="text"
            value={profileData.headline}
            onChange={(e) => onProfileDataChange(prev => ({
                ...prev,
                headline: e.target.value
            }))}
            placeholder="Headline"
            className="edit-input"
        />
        <input
            type="text"
            value={profileData.location}
            onChange={(e) => onProfileDataChange(prev => ({
                ...prev,
                location: e.target.value
            }))}
            placeholder="Location"
            className="edit-input"
        />
        <div className="edit-actions">
            <button onClick={onSave} className="save-btn">Save</button>
            <button onClick={onCancel} className="cancel-btn">Cancel</button>
        </div>
    </div>
);

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