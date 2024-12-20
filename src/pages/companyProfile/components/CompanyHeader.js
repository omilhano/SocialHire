import React, { useState } from 'react';
import { Pencil, MapPin, Globe2 } from 'lucide-react';
import DefaultCompanyPic from 'common/images/placeholderCompany.jpg';
import '../CompanyProfile.css';

export const CompanyHeader = ({
    companyData,
    editMode,
    onEditModeChange,
    onProfilePhotoChange,
    onCompanyDataChange
}) => (
    <div className="company-header">
        <div className="company-cover" />
        <div className="company-picture-container">
            <img
                src={companyData.profilePhoto || DefaultCompanyPic}
                alt="Company Logo"
                className="company-image"
            />
            <label className="company-picture-upload">
                <input
                    type="file"
                    accept="image/*"
                    onChange={onProfilePhotoChange}
                    className="hidden"
                />
                <Pencil className="edit-icon" size={16} />
            </label>
        </div>

        <div className="basic-info">
            {editMode.basic ? (
                <CompanyInfoForm
                    companyData={companyData}
                    onCompanyDataChange={onCompanyDataChange}
                    onSave={() => onEditModeChange({ basic: false })}
                    onCancel={() => onEditModeChange({ basic: false })}
                />
            ) : (
                <CompanyInfoDisplay
                    companyData={companyData}
                    onEdit={() => onEditModeChange({ basic: true })}
                />
            )}
        </div>
    </div>
);

const CompanyInfoForm = ({ companyData, onCompanyDataChange, onSave, onCancel }) => {
    const [formData, setFormData] = useState({ ...companyData });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = () => {
        if (onCompanyDataChange) {
            Object.keys(formData).forEach((field) =>
                onCompanyDataChange(field, formData[field])
            );
        }
        onSave?.();
    };

    const handleCancel = () => {
        setFormData({ ...companyData });
        onCancel?.();
    };

    return (
        <div className="edit-company-info">
            <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="Company Name"
                className="edit-input"
            />
            <input
                type="text"
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                placeholder="Industry"
                className="edit-input"
            />
            <select
                value={formData.companySize}
                onChange={(e) => handleInputChange('companySize', e.target.value)}
                className="edit-input"
            >
                <option value="">Select Company Size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501+">501+ employees</option>
            </select>
            <input
                type="url"
                value={formData.websiteUrl}
                onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                placeholder="Website URL"
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
            <textarea
                value={formData.companyDescription}
                onChange={(e) => handleInputChange('companyDescription', e.target.value)}
                placeholder="Company Description"
                className="edit-input description-input"
            />
            <div className="edit-actions">
                <button onClick={handleSave} className="save-btn">Save</button>
                <button onClick={handleCancel} className="cancel-btn">Cancel</button>
            </div>
        </div>
    );
};

const CompanyInfoDisplay = ({ companyData, onEdit }) => (
    <div className="info-display">
        <h1 className="company-name">{companyData.companyName}</h1>
        <p className="headline">{companyData.headline}</p>
        <div className="company-details">
            <p className="industry">{companyData.industry}</p>
            <p className="company-size">{companyData.companySize} employees</p>
            <p className="location">
                <MapPin size={16} className="icon" />
                {companyData.location}
            </p>
            <a 
                href={companyData.websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="website-link"
            >
                <Globe2 size={16} className="icon" />
                Website
            </a>
        </div>
        <p className="description">{companyData.companyDescription}</p>
        <button onClick={onEdit} className="edit-btn">
            <Pencil size={16} className="icon" />
            Edit Company Info
        </button>
    </div>
);

export default CompanyHeader;