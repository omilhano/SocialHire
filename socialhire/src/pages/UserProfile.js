import React, { useEffect, useState, useCallback } from 'react';
import { auth } from "../firebaseConfig";
import { useFirebaseUpload, useFirebaseDocument } from '../hooks/useFirebase';
import { validateProfileData, validateExperience } from '../utils/validation';
import { ProfileHeader } from '../components/profile/ProfileHeader.js';
import { Toast } from '../components/common/Toast';
import { AboutSection } from '../components/profile/AboutSection.js';
import { ExperienceSection } from '../components/profile/ExperienceSection.js';
import { PostsSection } from '../components/profile/PostsSection.js';
import '../styles/UserProfile.css';

const UserProfile = () => {
    // Custom hooks
    const { uploadFile } = useFirebaseUpload();
    const { updateDocument, getDocument } = useFirebaseDocument('users');
    const { updateDocument: updateExperience } = useFirebaseDocument('experience');
    const { updateDocument: updatePost } = useFirebaseDocument('posts');

    // State
    const [state, setState] = useState({
        profileData: {},
        experienceData:{},
        posts: [],
        loading: true,
        error: null,
        validation: {},
        editMode: { basic: false, about: false, experience: false }
    });

    const { profileData, experienceData, posts, loading, error, validation, editMode } = state;


    //
    // Profile (USERS TABLE)
    //


    // Fetch profile data
    const fetchProfile = useCallback(async () => {
        if (!auth.currentUser) return;

        const data = await getDocument(auth.currentUser.uid);
        if (data) {
            setState(prev => ({
                ...prev,
                profileData: data,
                loading: false
            }));
        }
    }, [getDocument]);

    // Handle profile updates
    const handleProfileUpdate = useCallback(async (field, value) => {
        // Validate data before update
        const validationResult = field === 'experience'
            ? validateExperience(value)
            : validateProfileData({ ...profileData, [field]: value });

        if (!validationResult.isValid) {
            setState(prev => ({
                ...prev,
                validation: validationResult.errors
            }));
            return;
        }

        const success = await updateDocument(auth.currentUser.uid, { [field]: value });
        console.log(auth.currentUser.uid)
        if (success) {
            setState(prev => ({
                ...prev,
                profileData: { ...prev.profileData, [field]: value },
                editMode: { ...prev.editMode, [field]: false },
                validation: {},
            }));
        }
    }, [profileData, updateDocument]);

    // Handle profile picture update
    const handleProfilePictureChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const photoURL = await uploadFile(file, 'profile-pictures');
        if (photoURL) {
            await handleProfileUpdate('profilePicture', photoURL);
        }
    };
    // Effects
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);


    //
    //Experience
    //

    // Handle Experience updates
    const handleExperienceUpdate = useCallback(async (field, value) => {
        // Validate data before update
        const validationResult = validateExperience(value)
        if (!validationResult.isValid) {
            setState(prev => ({
                ...prev,
                validation: validationResult.errors
            }));
            return;
        }

        const success = await updateExperience(auth.currentUser.uid, { [field]: value });
        if (success) {
            setState(prev => ({
                ...prev,
                profiexperienceDataleData: { ...prev.experienceData, [field]: value },
                editMode: { ...prev.editMode, [field]: false },
                validation: {},
            }));
        }
    }, [experienceData, updateExperience]);


    if (loading) {
        return <div className="loading">Loading profile...</div>;
    }

    return (
        <div className="profile-container">
            {error && (
                <Toast
                    message={error}
                    type="error"
                    onClose={() => setState(prev => ({ ...prev, error: null }))}
                />
            )}

            <ProfileHeader
                profileData={profileData}
                editMode={editMode?.basic || true}
                validation={validation}
                onEditModeChange={(mode) => setState(prev => ({
                    ...prev,
                    editMode: { ...prev.editMode, basic: mode }
                }))}
                onProfilePictureChange={handleProfilePictureChange}
                onProfileDataChange={handleProfileUpdate}
                onSaveBasicInfo={(value) => handleProfileUpdate('about', value)} />
            <AboutSection
                about={profileData.about}
                editMode={editMode.about}
                validation={validation.about}
                onEditModeChange={(mode) => setState(prev => ({
                    ...prev,
                    editMode: { ...prev.editMode, about: mode }
                }))}
                onSave={(value) => handleProfileUpdate('about', value)}
            />
            <ExperienceSection
                experience={experienceData}
                editMode={editMode.experience}
                validation={validation}
                onEditModeChange={(mode) => setState(prev => ({
                    ...prev,
                    editMode: { ...prev.editMode, experience: mode }
                }))}
                onAddExperience={(experience) => {
                    const updatedExperience = [...(experienceData || []), experience];
                    handleExperienceUpdate('experience', updatedExperience);
                }}
            />
        </div>
    );
};

export default UserProfile;