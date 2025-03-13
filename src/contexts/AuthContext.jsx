import React, { useContext, useState, useEffect } from 'react';

const AuthContext = React.createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:5000/api/current_user', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch user data');
                    }
                    return response.json();
                })
                .then(data => setCurrentUser(data.user))
                .catch(error => {
                    console.error('Error fetching user:', error);
                    localStorage.removeItem('token'); // Remove invalid token
                });
        }
    }, []);

    const login = (user) => {
        setCurrentUser(user);
        localStorage.setItem('token', user.token); // Assuming your response includes a token
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('token');
    };

    const value = {
        currentUser,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
