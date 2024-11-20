// utils/validation.js
export const validateProfileData = (data) => {
    const errors = {};

    if (!data.firstName?.trim()) {
        errors.firstName = 'First name is required';
    }

    if (!data.lastName?.trim()) {
        errors.lastName = 'Last name is required';
    }

    if (data.headline?.length > 100) {
        errors.headline = 'Headline must be less than 100 characters';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const validateExperience = (experience) => {
    const errors = {};

    if (!experience.title?.trim()) {
        errors.title = 'Title is required';
    }

    if (!experience.company?.trim()) {
        errors.company = 'Company is required';
    }

    if (!experience.startDate) {
        errors.startDate = 'Start date is required';
    }

    if (!experience.current && !experience.endDate) {
        errors.endDate = 'End date is required when not current position';
    }

    if (experience.endDate && experience.startDate) {
        const start = new Date(experience.startDate);
        const end = new Date(experience.endDate);
        if (end < start) {
            errors.endDate = 'End date cannot be before start date';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};