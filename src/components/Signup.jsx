import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Ensure correct path
import './Signup.css'; // Import the CSS file for styling

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch('http://localhost:5000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Signup failed. Please try again.');
            }

            const data = await response.json();

            if (data.success) {
                login(data.user); // Automatically log in after signup
                navigate('/');
            } else {
                setError('Signup error.');
            }
        } catch (error) {
            setError(error.message);
            console.error('Error signing up:', error);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-header">
                <h2>Signup</h2>
            </div>
            <form onSubmit={handleSubmit} className="signup-form">
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="signup-button">Signup</button>
            </form>
            {error && <p className="error-message">{error}</p>}
            <div className="signup-footer">
                <p>Already have an account? <a href="/login">Log in</a></p>
            </div>
        </div>
    );
};

export default Signup;
