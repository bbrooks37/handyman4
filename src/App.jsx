import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import ServicePage from './components/ServicePage';
import Signup from './components/Signup';
import Login from './components/Login';
import Account from './components/Account';
import HomePage from './components/HomePage';
import ThankYou from './components/ThankYou';
import { AuthProvider } from './contexts/AuthContext';
import Modal from 'react-modal';
import Navbar from './components/Navbar';
import './components/Navbar.css'; // Import Navbar CSS

Modal.setAppElement('#root');

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <div className="handyman-welcome">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/services/:serviceName" element={<ServicePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/thank-you" element={<ThankYou />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
