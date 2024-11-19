import React, { useState, useEffect } from 'react';
import { auth, db, storage } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Pencil, Plus, Briefcase, MapPin, Calendar } from 'lucide-react';
import '../styles/UserProfile.css';

const UserProfile = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState({
        basic: false,
        about: false,
        experience: false
    });
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        headline: '',
        location: '',
        about: '',
        experience: [],
        education: [],
        skills: [],
        profilePicture: '',
    });
    const [newExperience, setNewExperience] = useState({
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const currentUser = auth.currentUser;
                if (!currentUser) return;

                const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setProfileData(prevData => ({
                        ...prevData,
                        ...userData
                    }));
                    setCurrentUser(currentUser);
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleProfilePictureChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const storageRef = ref(storage, `profile-pictures/${auth.currentUser.uid}`);
            await uploadBytes(storageRef, file);
            const photoURL = await getDownloadURL(storageRef);

            await updateDoc(doc(db, "users", auth.currentUser.uid), {
                profilePicture: photoURL
            });

            setProfileData(prev => ({
                ...prev,
                profilePicture: photoURL
            }));
        } catch (error) {
            console.error("Error uploading profile picture:", error);
        }
    };

    const handleSaveBasicInfo = async () => {
        try {
            await updateDoc(doc(db, "users", auth.currentUser.uid), {
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                headline: profileData.headline,
                location: profileData.location
            });
            setEditMode(prev => ({ ...prev, basic: false }));
        } catch (error) {
            console.error("Error updating basic info:", error);
        }
    };

    const handleAddExperience = async () => {
        try {
            const updatedExperience = [...profileData.experience, newExperience];
            await updateDoc(doc(db, "users", auth.currentUser.uid), {
                experience: updatedExperience
            });
            setProfileData(prev => ({
                ...prev,
                experience: updatedExperience
            }));
            setNewExperience({
                title: '',
                company: '',
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                description: ''
            });
            setEditMode(prev => ({ ...prev, experience: false }));
        } catch (error) {
            console.error("Error adding experience:", error);
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="profile-container">
            {/* Profile Header Section */}
            <div className="profile-header">
                <div className="profile-cover">
                    {/* Cover photo could be added here */}
                    <div className="profile-picture-container">
                    <div className="profile-picture">
                        <img 
                            src={profileData.profilePicture || "/api/placeholder/150/150"} 
                            alt="Profile" 
                            className="profile-image"
                        />
                        <label className="profile-picture-upload">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleProfilePictureChange}
                                className="hidden"
                            />
                            <Pencil className="edit-icon" size={16} />
                        </label>
                    </div>
                </div>
                
                </div>

                {/* Basic Info Section */}
                <div className="basic-info">
                    {editMode.basic ? (
                        <div className="edit-basic-info">
                            <input
                                type="text"
                                value={profileData.firstName}
                                onChange={(e) => setProfileData(prev => ({
                                    ...prev,
                                    firstName: e.target.value
                                }))}
                                placeholder="First Name"
                                className="edit-input"
                            />
                            <input
                                type="text"
                                value={profileData.lastName}
                                onChange={(e) => setProfileData(prev => ({
                                    ...prev,
                                    lastName: e.target.value
                                }))}
                                placeholder="Last Name"
                                className="edit-input"
                            />
                            <input
                                type="text"
                                value={profileData.headline}
                                onChange={(e) => setProfileData(prev => ({
                                    ...prev,
                                    headline: e.target.value
                                }))}
                                placeholder="Headline"
                                className="edit-input"
                            />
                            <input
                                type="text"
                                value={profileData.location}
                                onChange={(e) => setProfileData(prev => ({
                                    ...prev,
                                    location: e.target.value
                                }))}
                                placeholder="Location"
                                className="edit-input"
                            />
                            <div className="edit-actions">
                                <button onClick={handleSaveBasicInfo} className="save-btn">
                                    Save
                                </button>
                                <button 
                                    onClick={() => setEditMode(prev => ({ ...prev, basic: false }))}
                                    className="cancel-btn"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="info-display">
                            <h1>{profileData.firstName} {profileData.lastName}</h1>
                            <p className="headline">{profileData.headline}</p>
                            <p className="location">
                                <MapPin size={16} />
                                {profileData.location}
                            </p>
                            <button 
                                onClick={() => setEditMode(prev => ({ ...prev, basic: true }))}
                                className="edit-btn"
                            >
                                <Pencil size={16} />
                                Edit Basic Info
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* About Section */}
            <div className="profile-section">
                <h2>About</h2>
                {editMode.about ? (
                    <div className="edit-about">
                        <textarea
                            value={profileData.about}
                            onChange={(e) => setProfileData(prev => ({
                                ...prev,
                                about: e.target.value
                            }))}
                            className="edit-textarea"
                        />
                        <div className="edit-actions">
                            <button onClick={() => {
                                // Save about logic
                                setEditMode(prev => ({ ...prev, about: false }));
                            }} className="save-btn">Save</button>
                            <button 
                                onClick={() => setEditMode(prev => ({ ...prev, about: false }))}
                                className="cancel-btn"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="about-content">
                        <p>{profileData.about}</p>
                        <button 
                            onClick={() => setEditMode(prev => ({ ...prev, about: true }))}
                            className="edit-btn"
                        >
                            <Pencil size={16} />
                            Edit About
                        </button>
                    </div>
                )}
            </div>

            {/* Experience Section */}
            <div className="profile-section">
                <div className="section-header">
                    <h2>Experience</h2>
                    <button 
                        onClick={() => setEditMode(prev => ({ ...prev, experience: true }))}
                        className="add-btn"
                    >
                        <Plus size={16} />
                        Add Experience
                    </button>
                </div>

                {editMode.experience && (
                    <div className="add-experience-form">
                        <input
                            type="text"
                            value={newExperience.title}
                            onChange={(e) => setNewExperience(prev => ({
                                ...prev,
                                title: e.target.value
                            }))}
                            placeholder="Job Title"
                            className="edit-input"
                        />
                        <input
                            type="text"
                            value={newExperience.company}
                            onChange={(e) => setNewExperience(prev => ({
                                ...prev,
                                company: e.target.value
                            }))}
                            placeholder="Company"
                            className="edit-input"
                        />
                        <div className="date-inputs">
                            <input
                                type="date"
                                value={newExperience.startDate}
                                onChange={(e) => setNewExperience(prev => ({
                                    ...prev,
                                    startDate: e.target.value
                                }))}
                                className="edit-input"
                            />
                            <input
                                type="date"
                                value={newExperience.endDate}
                                onChange={(e) => setNewExperience(prev => ({
                                    ...prev,
                                    endDate: e.target.value
                                }))}
                                className="edit-input"
                                disabled={newExperience.current}
                            />
                        </div>
                        <label className="current-job">
                            <input
                                type="checkbox"
                                checked={newExperience.current}
                                onChange={(e) => setNewExperience(prev => ({
                                    ...prev,
                                    current: e.target.checked
                                }))}
                            />
                            I currently work here
                        </label>
                        <textarea
                            value={newExperience.description}
                            onChange={(e) => setNewExperience(prev => ({
                                ...prev,
                                description: e.target.value
                            }))}
                            placeholder="Description"
                            className="edit-textarea"
                        />
                        <div className="edit-actions">
                            <button onClick={handleAddExperience} className="save-btn">
                                Add Experience
                            </button>
                            <button 
                                onClick={() => setEditMode(prev => ({ ...prev, experience: false }))}
                                className="cancel-btn"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                <div className="experience-list">
                    {profileData.experience.map((exp, index) => (
                        <div key={index} className="experience-item">
                            <div className="experience-icon">
                                <Briefcase size={24} />
                            </div>
                            <div className="experience-details">
                                <h3>{exp.title}</h3>
                                <p className="company">{exp.company}</p>
                                <p className="date">
                                    <Calendar size={16} />
                                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                </p>
                                <p className="description">{exp.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Posts Feed Section */}
            <div className="profile-section">
                <h2>Recent Posts</h2>
                <div className="posts-container">
                    {/* Posts will be populated here */}
                    <div className="post-placeholder">
                        Create your first post...
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;