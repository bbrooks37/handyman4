import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { currentUser, logout } = useAuth();

    return (
        <nav className="navbar">
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                {currentUser ? (
                    <>
                        <li><Link to="/account">Account</Link></li>
                        <li>
                            <button onClick={logout}>Logout</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li><Link to="/signup">Sign Up</Link></li>
                        <li><Link to="/login">Log In</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
