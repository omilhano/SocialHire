import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from "../firebaseConfig";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import '../styles/SignIn.css';

const SignIn = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Track authentication state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User is signed in:", user.uid);
            } else {
                console.log("No user is signed in.");
            }
        });

        return () => unsubscribe(); // Cleanup listener on component unmount
    }, []);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Sign in with Firebase Authentication
            const userCredential = await signInWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            // Get user data from Firestore
            const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

            if (userDoc.exists()) {
                const userData = userDoc.data();
                // Store user data in local storage
                localStorage.setItem('userProfile', JSON.stringify({
                    uid: userCredential.user.uid,
                    email: userCredential.user.email,
                    ...userData, // Include Firestore data
                }));

                // Redirect based on account type
                if (userData.accountType === 'company') {
                    navigate('/company-profile');
                } else {
                    navigate('/userProfile');
                }
            } else {
                throw new Error('User data not found');
            }

        } catch (error) {
            console.error('Sign in error:', error);
            let errorMessage = 'Failed to sign in. ';

            switch (error.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email or password.';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'This account has been disabled.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many failed attempts. Please try again later.';
                    break;
                default:
                    errorMessage += error.message;
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);

            // Check if user exists in Firestore
            const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

            if (userDoc.exists()) {
                const userData = userDoc.data();
                localStorage.setItem('userProfile', JSON.stringify({
                    uid: userCredential.user.uid,
                    email: userCredential.user.email,
                    ...userData,
                }));

                // Redirect based on account type
                if (userData.accountType === 'company') {
                    navigate('/company-profile');
                } else {
                    navigate('/userProfile');
                }
            } else {
                // New Google user, create profile in Firestore
                const newUser = {
                    firstName: userCredential.user.displayName?.split(' ')[0] || '',
                    lastName: userCredential.user.displayName?.split(' ')[1] || '',
                    email: userCredential.user.email,
                    accountType: 'user', // Default account type
                    createdAt: new Date().toISOString(),
                    userId: userCredential.user.uid,
                };

                await setDoc(doc(db, "users", userCredential.user.uid), newUser);
                localStorage.setItem('userProfile', JSON.stringify(newUser));
                navigate('/userProfile');
            }
        } catch (error) {
            console.error('Google sign in error:', error);
            setError('Failed to sign in with Google. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="signin-page">
            <div className="signin-card">
                <div className="signin-header">
                    <h2 className="signin-title">Welcome Back!</h2>
                    <p className="signin-subtitle">Sign in to your account</p>
                </div>

                <form className="signin-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className={`form-input ${error ? 'error' : ''}`}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className={`form-input ${error ? 'error' : ''}`}
                            placeholder="Enter your password"
                        />
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="auth-buttons">
                        <button
                            type="submit"
                            className="signin-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>

                        <button
                            type="button"
                            className="google-signin-button"
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                        >
                            Sign in with Google
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignIn;
