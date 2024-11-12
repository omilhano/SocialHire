import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignIn.css';

const SignIn = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Add your sign-in logic here
            console.log('Sign in data:', formData);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
        } catch (error) {
            console.error('Sign in error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            // Google sign-in logic here
            console.log('Google sign in clicked');
        } catch (error) {
            console.error('Google sign in error:', error);
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
                            className="form-input"
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
                            className="form-input"
                            placeholder="Enter your password"
                        />
                    </div>

                    <div className="form-options">
                        <label className="remember-me-label">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="checkbox-input"
                            />
                            <span>Remember me</span>
                        </label>

                        <button
                            type="button"
                            className="forgot-password"
                            onClick={() => navigate('/forgot-password')}
                        >
                            Forgot password?
                        </button>
                    </div>
                    <div className="auth-buttons">
                        <button
                            type="submit"
                            className="signin-button"
                            disabled={isLoading}
                        >
                            <span className="signin-button-label">
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </span>
                        </button>

                        <button
                            type="button"
                            className="google-signin-button"
                            onClick={handleGoogleSignIn}
                        >
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                                alt="Google logo"
                                className="google-icon"
                            />
                            Sign in with Google
                        </button>
                    </div>

                    <div className="signup-link">
                        <span>Don't have an account? </span>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate('/signup');
                            }}
                            className="register-link"
                        >
                            Register
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignIn;