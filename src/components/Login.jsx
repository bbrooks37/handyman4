import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css'; // Import the CSS file for styling

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Optionally, you can also verify the token with the server here
            navigate('/');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed. Please check your email and password.');
            }

            const data = await response.json();

            if (data.success) {
                login(data.user);
                if (rememberMe) {
                    localStorage.setItem('token', data.user.token); // Assuming the response includes a token
                }
                navigate('/');
            } else {
                setError('Invalid credentials.');
            }
        } catch (error) {
            setError(error.message);
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-header">
                <h2>Login</h2>
            </div>
            <form onSubmit={handleSubmit} className="login-form">
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
                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        Remember Me
                    </label>
                </div>
                <button type="submit" className="login-button">Login</button>
            </form>
            {error && <p className="error-message">{error}</p>}
            <div className="login-footer">
                <p>Don't have an account? <a href="/signup">Signup</a></p>
            </div>
        </div>
    );
};

export default Login;
