import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignUp.css';

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        accountType: 'jobseeker'
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }
        
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                // Add your sign-up logic here
                console.log('Sign up data:', formData);
            } catch (error) {
                console.error('Sign up error:', error);
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
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
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
                        >
                            <option value="jobseeker">Job Seeker</option>
                            <option value="employer">Employer</option>
                            <option value="recruiter">Recruiter</option>
                        </select>
                    </div>

                    <button type="submit" className="signup-button">
                        Create Account
                    </button>

                    <div className="signin-link">
                        <span className="signin-text">Already have an account?</span>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate('/signin');
                            }}
                            className="login-link"
                        >
                            Sign in
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;