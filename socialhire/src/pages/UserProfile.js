import React, { useEffect, useState, useCallback } from 'react';
import {
    setPersistence,
    browserSessionPersistence, onAuthStateChanged
} from "firebase/auth"; // Simplified imports to use only what's needed
import { auth } from "../firebaseConfig";
import { useFirebaseUpload, useFirebaseDocument } from '../hooks/useFirebase';
import { validateProfileData, validateExperience, validatePost } from '../utils/validation';
import { useNavigate } from 'react-router-dom';
import { ProfileHeader } from '../components/profile/ProfileHeader.js';
import { Toast } from '../components/common/Toast';
import { AboutSection } from '../components/profile/AboutSection.js';
import { ExperienceSection } from '../components/profile/ExperienceSection.js';
import { PostSection } from '../components/profile/PostsSection.js';
import '../styles/UserProfile.css';

const UserProfile = () => {
    const navigate = useNavigate();
    const { uploadFile } = useFirebaseUpload();
    const { updateDocument, getDocument } = useFirebaseDocument('users');
    const { updateDocument: updateExperience, getDocumentsByUserId } = useFirebaseDocument('experience');
    const { addDocument: addExperience } = useFirebaseDocument('experience');
    const { updateDocument: updatePost, getDocumentsByUserId: getPostsByUserId} = useFirebaseDocument('posts');
    const { addDocument: addPost } = useFirebaseDocument('posts');
    
    // State
    const [state, setState] = useState({
        profileData: {},
        experienceData: {},
        postData: [],
        loading: true,
        error: null,
        validation: {},
        editMode: { basic: false, about: false, experience: false, post: false }
    });

    const { profileData, experienceData, postData, loading, error, validation, editMode } = state;


    // Profile (USERS TABLE)

    // Fetch data
    const fetchProfile = useCallback(async () => {
        if (!auth.currentUser) return;

        try {
            const profile = await getDocument('users', auth.currentUser.uid);
            // Fetch experience data
            const experiences = await getDocumentsByUserId('experience', auth.currentUser.uid);
            const posts = await getPostsByUserId('posts', auth.currentUser.uid);

            console.log("Experiences: ", experiences)
            setState(prev => ({
                ...prev,
                profileData: profile || {},
                experienceData: experiences || [],
                postData: posts || [],

                loading: false,
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: "Failed to fetch profile data.",
                loading: false
            }));
        }
    }, [getDocument, getDocumentsByUserId, getPostsByUserId]);

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
        console.log("User trying to updaye in user Profile", auth.currentUser.uid, { [field]: value });

        const validationResult = field === 'users'
            ? validateExperience(value)
            : validateProfileData({ ...profileData, [field]: value });
        
        console.log("User trying to updaye in user Profile", auth.currentUser.uid, { [field]: value });

        if (!validationResult.isValid) {
            setState(prev => ({
                ...prev,
                validation: validationResult.errors
            }));
            return;
        }
        console.log("iS VALID? ", !validationResult.isValid);

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
            navigate('/signin'); // Redirect to the sign-in page
            navigate('/signin');
        } catch (error) {
            console.error("Error during logout:", error.message);
        }
    };

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

    // Effects
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    //
    // Experience
    //

    // Add a new experience or update an existing one
    const handleExperienceUpdate = useCallback(async (experience) => {
        const validationResult = validateExperience(experience);
        console.log("Experience data being sent to handleExperienceUpdate"); // Debug log
        console.log("Experience data is invalid?", !validationResult.isValid); // Debug log
        if (!validationResult.isValid) {
            setState(prev => ({
                ...prev,
                validation: validationResult.errors
            }));
            return;
        }
        console.log("Experience data being sent to addDocument:", experience); // Debug log
        console.log("Experience id", experience.id); // Debug log
        const newExperienceId = experience.id || Date.now().toString();
        let success;
        if (experience.id) {
            // Update existing experience
            success = await updateExperience('experience', experience.id, experience);
        } else {
            // Assign new ID and add the experience
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



    //
    // Posts
    //

    // Add a new Post or update an existing one
    const handlePostUpdate = useCallback(async (post) => {
        const validationResult = validatePost(post);
        console.log("Post data being sent to handlePostUpdate", post); // Debug log
        console.log("Post data is invalid?", !validationResult.isValid); // Debug log
        if (!validationResult.isValid) {
            setState(prev => ({
                ...prev,
                validation: validationResult.errors
            }));
            return;
        }
        console.log("Post data being sent to addDocument:", post); // Debug log
        const newPostId = post.id || Date.now().toString();
        const success = post.id
        ? await updateExperience('posts', post.id, post)
        : post.id = newPostId; await addExperience('posts', newPostId, { ...post });
        if (success) {
            setState(prev => ({
                ...prev,
                postData: post.id
                    ? prev.postData.map(exp => (exp.id === post.id ? post : exp))
                    : [...prev.postData, { ...post, id: newPostId }],
                editMode: { ...prev.editMode, post: false },
                validation: {},
            }));
        }
    }, [updatePost, addPost]);


    if (loading) {
        return <div className="loading">Loading profile...</div>;
    }

    ///////////////////////////////////////////////////////////////////////////////////////

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
            <button className="logout" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

export default UserProfile;
