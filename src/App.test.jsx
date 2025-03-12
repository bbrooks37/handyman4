import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import App from './App';
import HomePage from './HomePage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import ServicePage from './ServicePage';
import Signup from './Signup';
import Login from './Login';
import Account from './Account';
import { auth } from './firebase';

// Mock the Firebase auth module
jest.mock('./firebase', () => ({
    auth: {
        onAuthStateChanged: jest.fn(),
        signOut: jest.fn()
    }
}));

/**
 * Test suite for the App component.
 */
describe('App', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    /**
     * Test case to check if the navigation links render correctly.
     */
    it('renders navigation links', () => {
        render(<App />);
        expect(screen.getByText(/home/i)).toBeInTheDocument();
        expect(screen.getByText(/about/i)).toBeInTheDocument();
        expect(screen.getByText(/contact/i)).toBeInTheDocument();
        expect(screen.getByText(/sign up/i)).toBeInTheDocument();
        expect(screen.getByText(/log in/i)).toBeInTheDocument();
    });

    /**
     * Test case to check if the home page renders correctly.
     */
    it('renders the home page', () => {
        render(<App />);
        expect(screen.getByText(/your trusted partner for yard repairs and cleanups/i)).toBeInTheDocument();
    });

    /**
     * Test case to check if the about page renders correctly.
     */
    it('renders the about page', async () => {
        render(<App />);
        fireEvent.click(screen.getByText(/about/i));
        await waitFor(() => {
            expect(screen.getByText(/about brandon brooks/i)).toBeInTheDocument();
        });
    });

    /**
     * Test case to check if the contact page renders correctly.
     */
    it('renders the contact page', async () => {
        render(<App />);
        fireEvent.click(screen.getByText(/contact/i));
        await waitFor(() => {
            expect(screen.getByText(/contact us/i)).toBeInTheDocument();
        });
    });

    /**
     * Test case to check if the service page renders correctly.
     */
    it('renders the service page', async () => {
        render(<App />);
        fireEvent.click(screen.getByText(/yard cleanup's/i));
        await waitFor(() => {
            expect(screen.getByText(/trimming trees, pressure washing/i)).toBeInTheDocument();
        });
    });

    /**
     * Test case to check if the signup page renders correctly.
     */
    it('renders the signup page', async () => {
        render(<App />);
        fireEvent.click(screen.getByText(/sign up/i));
        await waitFor(() => {
            expect(screen.getByText(/sign up/i)).toBeInTheDocument();
        });
    });

    /**
     * Test case to check if the login page renders correctly.
     */
    it('renders the login page', async () => {
        render(<App />);
        fireEvent.click(screen.getByText(/log in/i));
        await waitFor(() => {
            expect(screen.getByText(/log in/i)).toBeInTheDocument();
        });
    });

    /**
     * Test case to check if the account page renders correctly when logged in.
     */
    it('renders the account page when logged in', async () => {
        auth.onAuthStateChanged.mockImplementation((callback) => callback({ uid: '123' }));
        render(<App />);
        fireEvent.click(screen.getByText(/account/i));
        await waitFor(() => {
            expect(screen.getByText(/account details/i)).toBeInTheDocument();
        });
    });

    /**
     * Test case to check if logout works correctly.
     */
    it('logs out the user when logout button is clicked', async () => {
        auth.onAuthStateChanged.mockImplementation((callback) => callback({ uid: '123' }));
        render(<App />);
        fireEvent.click(screen.getByText(/logout/i));
        await waitFor(() => {
            expect(auth.signOut).toHaveBeenCalled();
        });
    });
});
