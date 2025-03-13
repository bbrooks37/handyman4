import React, { useState } from "react";
import "../App.css";
import { useNavigate } from 'react-router-dom';

function ContactPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message }),
            });

            const data = await response.json();
            if (data.success) {
                // Redirect to Thank You page
                navigate('/thank-you');
            } else {
                setError('Submission failed. Please try again.');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className="contact-page">
            <div className="contact-container">
                <h2>Contact Us</h2>
                <p>We're here to help with all your handyman needs in Lakeland, Florida!</p>

                <div className="contact-info">
                    <h3>Contact Information</h3>
                    <p><strong>Phone:</strong> 813-503-5735</p>
                    <p>
                        <strong>Email:</strong>{" "}
                        <a href="mailto:brandon37.brooks@gmail.com">brandon37.brooks@gmail.com</a>
                    </p>
                </div>

                <div className="contact-form-container">
                    <h3>Send Us a Message</h3>
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message" className="form-label">Message:</label>
                            <textarea
                                id="message"
                                name="message"
                                className="form-control"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="submit-button">Send</button>
                    </form>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>

                <div className="map-placeholder">
                    <p>Map of our service area coming soon!</p>
                </div>

                <div className="scheduling-link">
                    <a href="YOUR_SCHEDULING_LINK">Schedule a Consultation</a>
                </div>
            </div>
        </div>
    );
}

export default ContactPage;
