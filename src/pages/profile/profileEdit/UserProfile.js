import React, { useEffect, useState, useCallback } from 'react';
import {
    setPersistence,
    browserSessionPersistence, onAuthStateChanged
} from "firebase/auth"; // Simplified imports to use only what's needed
import { auth } from "firebaseConfig";
import { useFirebaseUpload, useFirebaseDocument } from 'hooks/useFirebase';
import { validateProfileData, validateExperience, validatePost } from 'utils/validation';
import { useNavigate } from 'react-router-dom';
import { ProfileHeader } from './components/ProfileHeader.js';
import { Toast } from 'components/common/Toast';
import { AboutSection } from './components/AboutSection.js';
import { ExperienceSection } from './components/ExperienceSection.js';
import { PostSection } from './components/PostsSection.js';
import { JobPostsSection } from '../components/jobPosts/JobPostsSection';
import ToggleSwitch from 'components/common/ToggleSwitch';
import './UserProfile.css';

const UserProfile = () => {
    const navigate = useNavigate();
    const { uploadFile } = useFirebaseUpload();
    const { updateDocument, getDocument } = useFirebaseDocument('users');
    const { updateDocument: updateExperience, getDocumentsByUserId } = useFirebaseDocument('experience');
    const { addDocument: addExperience } = useFirebaseDocument('experience');
    const { updateDocument: updatePost, getDocumentsByUserId: getPostsByUserId } = useFirebaseDocument('posts');
    const { addDocument: addPost } = useFirebaseDocument('posts');
    const { getDocumentsByUserId: getJobsByUserId, deleteDocument: deleteJob } = useFirebaseDocument('jobs');

    // State
    const [state, setState] = useState({
        profileData: {},
        experienceData: {},
        postData: [],
        jobData: [],
        loading: true,
        error: null,
        validation: {},
        editMode: { basic: false, about: false, experience: false, post: false, jobs: false },
        privateProfile: false, // New state for the toggle
    });

    const { profileData, experienceData, postData, jobData, loading, error, validation, editMode, privateProfile } = state;



    // Fetch profile data
    const fetchProfile = useCallback(async () => {
        if (!auth.currentUser) return;

        try {
            const profile = await getDocument('users', auth.currentUser.uid);
            const experiences = await getDocumentsByUserId('experience', auth.currentUser.uid);
            const posts = await getPostsByUserId('posts', auth.currentUser.uid);
            const jobs = await getJobsByUserId('jobs', auth.currentUser.uid);
            console.log("Jobs fetched in UserProfile:", jobs);

            console.log("Experiences: ", experiences);
            setState(prev => ({
                ...prev,
                profileData: profile || {},
                experienceData: experiences || [],
                postData: posts || [],
                jobData: jobs || [],
                privateProfile: profile?.privateProfile || false,
                loading: false,
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: "Failed to fetch profile data.",
                loading: false
            }));
        }
    }, [getDocument, getDocumentsByUserId, getPostsByUserId, getJobsByUserId]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchProfile();
                console.log("Job data fetched in UserProfile:", jobData);

            } else {
                navigate('/signin');
            }
        });

        return () => unsubscribe();
    }, [fetchProfile, navigate]);

    const handleTogglePrivacy = async (checked) => {
        try {
            setState((prevState) => ({ ...prevState, privateProfile: checked }));
            await updateDocument('users', auth.currentUser.uid, { privateProfile: checked });
            console.log(`Profile is now ${checked ? 'Private' : 'Public'}`);
        } catch (error) {
            console.error("Failed to update privacy setting:", error.message);
            setState(prevState => ({ ...prevState, error: "Failed to update privacy setting." }));
        }
    };

    // // Toggle  handler
    // const handleTogglePrivacy = (checked) => {
    //     setState((prevState) => ({ ...prevState, privateProfile: checked }));
    //     console.log(`Profile is ${checked ? 'Private' : 'Public'}`);
    // };

    const handleProfileUpdate = useCallback(async (field, value) => {
        console.log("User trying to update in UserProfile", auth.currentUser.uid, { [field]: value });

        const validationResult = field === 'users'
            ? validateExperience(value)
            : validateProfileData({ ...profileData, [field]: value });

        if (!validationResult.isValid) {
            setState(prev => ({
                ...prev,
                validation: validationResult.errors
            }));
            return;
        }

        const success = await updateDocument('users', auth.currentUser.uid, { [field]: value });
        if (success) {
            setState(prev => ({
                ...prev,
                profileData: { ...prev.profileData, [field]: value },
                editMode: { ...prev.editMode, [field]: false },
                validation: {},
            }));
        }
    }, [profileData, updateDocument]);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            console.log("User logged out");
            navigate('/signin');
        } catch (error) {
            console.error("Error during logout:", error.message);
        }
    };

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

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleExperienceUpdate = useCallback(async (experience) => {
        const validationResult = validateExperience(experience);
        if (!validationResult.isValid) {
            setState(prev => ({
                ...prev,
                validation: validationResult.errors
            }));
            return;
        }

        const newExperienceId = experience.id || Date.now().toString();
        let success;
        if (experience.id) {
            success = await updateExperience('experience', experience.id, experience);
        } else {
            experience.id = newExperienceId;
            success = await addExperience('experience', newExperienceId, { ...experience });
        }

        if (success) {
            setState(prev => ({
                ...prev,
                experienceData: experience.id
                    ? prev.experienceData.map(exp => (exp.id === experience.id ? experience : exp))
                    : [...prev.experienceData, { ...experience, id: newExperienceId }],
                editMode: { ...prev.editMode, experience: false },
                validation: {},
            }));
        }
    }, [updateExperience, addExperience]);

    const handlePostUpdate = useCallback(async (post) => {
        const validationResult = validatePost(post);
        if (!validationResult.isValid) {
            setState(prev => ({
                ...prev,
                validation: validationResult.errors
            }));
            return;
        }

        const newPostId = post.id || Date.now().toString();
        const success = post.id
            ? await updatePost('posts', post.id, post)
            : await addPost('posts', newPostId, { ...post });

        if (success) {
            setState(prev => ({
                ...prev,
                postData: post.id
                    ? prev.postData.map(p => (p.id === post.id ? post : p))
                    : [...prev.postData, { ...post, id: newPostId }],
                editMode: { ...prev.editMode, post: false },
                validation: {},
            }));
        }
    }, [updatePost, addPost]);

    const handleDeleteJob = async (jobID) => {
        try {
            await deleteJob('jobs', jobID);
            setState(prev => ({
                ...prev,
                jobData: prev.jobData.filter(job => job.jobID !== jobID),
            }));
            console.log("Job deleted successfully:", jobID);
        } catch (error) {
            console.error("Failed to delete job:", error.message);
            setState(prev => ({
                ...prev,
                error: "Failed to delete job.",
            }));
        }
    };

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
                onProfileDataChange={(field, value) => handleProfileUpdate(field, value)}
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
                experiences={experienceData}
                editMode={editMode.experience}
                onEditModeChange={(mode) => setState(prev => ({
                    ...prev,
                    editMode: { ...prev.editMode, experience: mode }
                }))}
                onAddExperience={(experience) => handleExperienceUpdate(experience)}
            />
            <PostSection
                posts={postData}
                editMode={editMode.post}
                onEditModeChange={(mode) => setState(prev => ({
                    ...prev,
                    editMode: { ...prev.editMode, post: mode }
                }))}
                onAddPost={(post) => handlePostUpdate(post)}
            />
            <JobPostsSection
                jobs={jobData}
                editMode={editMode.jobs}
                onDeleteJob={handleDeleteJob}
            />
            <div className="toggle-container">
                <span> Privatize toggle:</span>
                <ToggleSwitch
                    id="privacy-toggle"
                    checked={privateProfile}
                    onChange={handleTogglePrivacy}
                />
            </div>
            <button className="logout" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

export default UserProfile;
