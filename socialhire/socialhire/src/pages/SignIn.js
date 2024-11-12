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

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Add your sign-in logic here
            console.log('Sign in data:', formData);
        } catch (error) {
            console.error('Sign in error:', error);
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
                        <div className="remember-me">
                            <input
                                id="rememberMe"
                                name="rememberMe"
                                type="checkbox"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="checkbox-input"
                            />
                            <label htmlFor="rememberMe" className="form-label">
                                Remember me
                            </label>
                        </div>

                        <button 
                            type="button" 
                            className="forgot-password"
                            onClick={() => navigate('/forgot-password')}
                        >
                            Forgot password?
                        </button>
                    </div>

                    <button type="submit" className="signin-button">
                        Sign in
                    </button>

                    <div className="signup-link">
                        <span className="signup-text">Don't have an account?</span>
                        <button
                            type="button"
                            onClick={() => navigate('/signup')}
                            className="signup-button"
                        >
                            Sign up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignIn;