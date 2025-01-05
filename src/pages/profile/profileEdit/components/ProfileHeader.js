import React, { useState } from 'react';
import { Pencil, MapPin } from 'lucide-react';
import DefaultProfilePic from 'common/images/placeholderPic.jpg';
import './ProfileHeader.css';
import { auth, db, storage } from "firebaseConfig"; // Adjust path based on location
import { doc, getDoc, updateDoc, collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

/**
 * Profile Header
 * 
 * Parameters:
 * - profileData (Object): The profile data object containing the user's profile information 
 *   (e.g., profilePicture, firstName, lastName, headline, location).
 * - editMode (Object): A flag that determines which section is in edit mode. It contains a key basic, which is true if the "Basic Info" section is in edit mode and false otherwise.
 * - onEditModeChange (Function): A callback function that toggles between view and edit modes for specific sections. 
 *   It takes an object with the section's key (basic) and a boolean (true to enable edit mode).
 * - onProfilePictureChange (Function): A callback function triggered when the user selects a new profile picture. It handles the file change event.
 * - onProfileDataChange (Function): A callback function that updates the profile data. 
 *   It receives the field name and the new value to update.
 * Description:
 * The ProfileHeader component displays the user's profile information at the top of their profile page. 
 * It shows the profile picture, along with basic personal information like the user's name, headline, and location.
 * It provides functionality for switching between edit and view modes for the "Basic Info" section.
*/

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
            <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Location"
                className="edit-input"
            />
            <select
                value={formData.jobSeekingStatus || ""}
                onChange={(e) => handleInputChange('jobSeekingStatus', e.target.value)}
                className="edit-input"
            >
                <option value="" disabled>
                    Select Job Seeking Status   
                </option>
                <option value="Open to Work">Open to Work</option>
                <option value="Not Looking">Not Looking</option>
                <option value="Exploring Opportunities">Exploring Opportunities</option>
                <option value="No Display"> No Banner Displayed </option>
            </select>
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
        {/* <p className="headline">{profileData.headline}</p> TODO maybe not needed*/} 
        <p className="location">
            <MapPin size={16} />
            {profileData.location}
        </p>
        <div className="jobSeekingStatus">
            <h1 className="status-header">Job Seeking Status</h1>
            {/* Render the banner only if jobSeekingStatus is set */}
            {profileData.jobSeekingStatus && profileData.jobSeekingStatus !== "No Display" && (
                <p className="job-seeking-status">
                    {profileData.jobSeekingStatus}
                </p>
                )}
        </div>
        {/*TODO: add current job title*/}
        <button onClick={onEdit} className="edit-btn">
            <Pencil size={16} />
            Edit Basic Info
        </button>
    </div>
);