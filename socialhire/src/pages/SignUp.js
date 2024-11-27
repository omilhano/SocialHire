import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore"; // maybe need a hook instead of this
import '../styles/SignUp.css';
import useRedirectIfLoggedIn from "../hooks/useRedirectIfLoggedIn";
import sendWelcomeEmail from '../components/EmailSend';


const SignUp = () => {
    useRedirectIfLoggedIn(); // Hook to redirect logged-in users
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        username: '',
        accountType: 'user'
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false); // Track terms acceptance

    const validateForm = () => {
        const newErrors = {};

        // Validate First Name
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        } else if (formData.firstName.length < 2) {
            newErrors.firstName = 'First name must be at least 2 characters';
        }

        // Validate Last Name
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        } else if (formData.lastName.length < 2) {
            newErrors.lastName = 'Last name must be at least 2 characters';
        }
        

        // Validate Email
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }

        // Validate Password
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        } else if (!/(?=.*[0-9])/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one number';
        }

        // Validate Confirm Password
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // Validate Username (length only, as uniqueness is checked separately)
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters long';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const checkUsernameExists = async (username) => {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);
    
        return !querySnapshot.empty; // True if a user with the username exists
    };
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleTermsChange = (e) => {
        setTermsAccepted(e.target.checked);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Check if username is unique first
        const usernameExists = await checkUsernameExists(formData.username);
        if (usernameExists) {
            setErrors(prev => ({ ...prev, username: 'Username is already taken' }));
            return; // Stop further execution if username is not unique
        }

        if (validateForm()) {
            setIsSubmitting(true);
            try {
                // Create authentication user
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    formData.email,
                    formData.password
                );

                // Get the user ID from authentication
                const userId = userCredential.user.uid;


                // User is created
                // Create user document in Firestore
                await setDoc(doc(db, "users", userId), {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    username: formData.username,
                    email: formData.email,
                    accountType: formData.accountType,
                    createdAt: new Date().toISOString(),
                    userId: userId // Store the userId for reference
                    // Note: We don't store the password in Firestore
                });

                sendWelcomeEmail(formData);
                
                console.log("User account created successfully!");
                alert("Account created successfully! Please sign in.");
                navigate('/signin');

            } catch (error) {
                console.error("Error creating account:", error);
                let errorMessage = 'Failed to create account. ';

                switch (error.code) {
                    case 'auth/email-already-in-use':
                        errorMessage += 'Email is already registered.';
                        setErrors(prev => ({ ...prev, email: 'Email is already registered' }));
                        break;
                    case 'auth/invalid-email':
                        errorMessage += 'Invalid email address.';
                        setErrors(prev => ({ ...prev, email: 'Invalid email address' }));
                        break;
                    case 'auth/operation-not-allowed':
                        errorMessage += 'Email/password accounts are not enabled. Please contact support.';
                        break;
                    case 'auth/weak-password':
                        errorMessage += 'Please choose a stronger password.';
                        setErrors(prev => ({ ...prev, password: 'Please choose a stronger password' }));
                        break;
                    default:
                        errorMessage += error.message;
                }

                setErrors(prev => ({
                    ...prev,
                    submit: errorMessage
                }));
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-card">
                <div className="signup-header">
                    <h2 className="signup-title">Create Account</h2>
                    <p className="signup-subtitle">Join our professional network</p>
                </div>

                <form className="signup-form" onSubmit={handleSubmit}>
                    <div className="name-fields">
                        <div className="form-group">
                            <label htmlFor="firstName" className="form-label">
                                First Name
                            </label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={`form-input ${errors.firstName ? 'error' : ''}`}
                                disabled={isSubmitting}
                            />
                            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName" className="form-label">
                                Last Name
                            </label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={`form-input ${errors.lastName ? 'error' : ''}`}
                                disabled={isSubmitting}
                            />
                            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`form-input ${errors.email ? 'error' : ''}`}
                            disabled={isSubmitting}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="username" className="form-label">
                            Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            className={`form-input ${errors.username ? 'error' : ''}`}
                            disabled={isSubmitting}
                        />
                        {errors.username && <span className="error-message">{errors.username}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`form-input ${errors.password ? 'error' : ''}`}
                            disabled={isSubmitting}
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                            disabled={isSubmitting}
                        />
                        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="accountType" className="form-label">
                            Account Type
                        </label>
                        <select
                            id="accountType"
                            name="accountType"
                            value={formData.accountType}
                            onChange={handleChange}
                            className="form-select"
                            disabled={isSubmitting}
                        >
                            <option value="user">User</option>
                            <option value="company">Company</option>
                        </select>
                    </div>

                    {errors.submit && (
                        <div className="error-message submit-error">
                            {errors.submit}
                        </div>
                    )}

                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={termsAccepted}
                                onChange={handleTermsChange}
                                disabled={isSubmitting}
                            />
                            <span>
                                I agree to the
                                <a href="/tos" target="_blank" rel="noopener noreferrer"> Terms and Conditions </a>
                                and
                                <a href="/privacypolicy" target="_blank" rel="noopener noreferrer"> Privacy Policy</a>.
                            </span>
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        className="signup-button"
                        disabled={isSubmitting || !termsAccepted}
                    >
                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </button>

                    <div className="signin-link">
                        <span className="signin-text">Already have an account? </span>
                        <button
                            type="button"
                            onClick={() => navigate('/signin')}
                            className="login-link"
                            disabled={isSubmitting}
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;