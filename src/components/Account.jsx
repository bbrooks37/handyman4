import React, { useState, useEffect } from 'react';
import Slideshow from './Slideshow';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Account() {
    const { currentUser, loading } = useAuth();
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        const fetchAccountDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/account', { // Ensure correct URL
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        navigate('/login');
                        return;
                    }
                    throw new Error('Failed to fetch account details');
                }

                const data = await response.json();
                setUserData(data.user);
            } catch (error) {
                console.error('Error fetching account details:', error);
            }
        };

        fetchAccountDetails();
    }, [currentUser, navigate]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!currentUser) {
        return <p>Please log in to view your account.</p>;
    }

    return (
        <div>
            <h2>Account Details</h2>
            <p><strong>Email:</strong> {userData ? userData.email : currentUser.email}</p>
            <h3>Our Work</h3>
            <Slideshow />
        </div>
    );
}

export default Account;
