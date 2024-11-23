import React, { useEffect, useState, useCallback } from 'react';
import {
    setPersistence,
    browserSessionPersistence, onAuthStateChanged
} from "firebase/auth"; // Simplified imports to use only what's needed
import { auth } from "../firebaseConfig";
import { useFirebaseUpload, useFirebaseDocument } from '../hooks/useFirebase';
import { validateProfileData, validateExperience } from '../utils/validation';
import { useNavigate } from 'react-router-dom';
import { ProfileHeader } from '../components/profile/ProfileHeader.js';
import { Toast } from '../components/common/Toast';
import { AboutSection } from '../components/profile/AboutSection.js';
import { ExperienceSection } from '../components/profile/ExperienceSection.js';
import '../styles/UserProfile.css';

const UserProfile = () => {
    const navigate = useNavigate();
    const { uploadFile } = useFirebaseUpload();
    const { updateDocument, getDocument } = useFirebaseDocument('users');
    const { updateDocument: updateExperience } = useFirebaseDocument('experience');

    // State
    const [state, setState] = useState({
        profileData: {},
        experienceData: [],
        loading: true,
        error: null,
        validation: {},
        editMode: { basic: false, about: false, experience: false }
    });

    const { profileData, experienceData, loading, error, validation, editMode } = state;

    // Configure session persistence to "Session"
    useEffect(() => {
        setPersistence(auth, browserSessionPersistence)
            .then(() => console.log("Session persistence set successfully."))
            .catch((error) => console.error("Error setting persistence:", error.message));
    }, []);


    // Fetch profile data
    const fetchProfile = useCallback(async () => {
        if (!auth.currentUser) return;

        try {
            const data = await getDocument(auth.currentUser.uid);
            if (data) {
                setState(prev => ({
                    ...prev,
                    profileData: data,
                    loading: false
                }));
            }
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: "Failed to fetch profile data.",
                loading: false
            }));
        }
    }, [getDocument]);

    // When refreshes shows profile again
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchProfile(); // Fetch the profile only when the user is authenticated
            } else {
                navigate('/signin'); // Redirect to sign-in if no user
            }
        });

        return () => unsubscribe(); // Cleanup the listener on unmount
    }, [fetchProfile, navigate]);

    // Handle profile updates
    const handleProfileUpdate = useCallback(async (field, value) => {
        const validationResult =
            field === 'experience'
                ? validateExperience(value)
                : validateProfileData({ ...profileData, [field]: value });

        if (!validationResult.isValid) {
            setState(prev => ({
                ...prev,
                validation: validationResult.errors
            }));
            return;
        }

        try {
            const success = await updateDocument(auth.currentUser.uid, { [field]: value });
            if (success) {
                setState(prev => ({
                    ...prev,
                    profileData: { ...prev.profileData, [field]: value },
                    editMode: { ...prev.editMode, [field]: false },
                    validation: {},
                }));
            }
        } catch (error) {
            console.error("Error updating profile:", error.message);
        }
    }, [profileData, updateDocument]);

    // Handle profile picture update
    const handleProfilePictureChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const photoURL = await uploadFile(file, 'profile-pictures');
            if (photoURL) {
                await handleProfileUpdate('profilePicture', photoURL);
            }
        } catch (error) {
            console.error("Error uploading profile picture:", error.message);
        }
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/signin');
        } catch (error) {
            console.error("Error during logout:", error.message);
        }
    };

    // Handle experience updates
    const handleExperienceUpdate = useCallback(async (updatedExperience) => {
        const validationResult = validateExperience(updatedExperience);

        if (!validationResult.isValid) {
            setState(prev => ({
                ...prev,
                validation: validationResult.errors
            }));
            return;
        }

        try {
            const success = await updateExperience(auth.currentUser.uid, { experience: updatedExperience });
            if (success) {
                setState(prev => ({
                    ...prev,
                    experienceData: updatedExperience,
                    editMode: { ...prev.editMode, experience: false },
                    validation: {},
                }));
            }
        } catch (error) {
            console.error("Error updating experience:", error.message);
        }
    }, [updateExperience]);

    // Fetch profile data on component mount
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

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
                editMode={editMode.basic}
                validation={validation}
                onEditModeChange={(mode) => setState(prev => ({
                    ...prev,
                    editMode: { ...prev.editMode, basic: mode }
                }))}
                onProfilePictureChange={handleProfilePictureChange}
                onSaveBasicInfo={(value) => handleProfileUpdate('about', value)}
            />
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
                onAddExperience={(newExperience) => {
                    const updatedExperience = [...experienceData, newExperience];
                    handleExperienceUpdate(updatedExperience);
                }}
            />
            <button className="logout" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

export default UserProfile;
