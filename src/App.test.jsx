import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import App from './App';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import ServicePage from './components/ServicePage';
import Signup from './components/Signup';
import Login from './components/Login';
import Account from './components/Account';
import jwtDecode from 'jwt-decode';

// Mock the jwtDecode function and localStorage
jest.mock('jwt-decode', () => jest.fn());
jest.spyOn(window.localStorage.__proto__, 'getItem');
jest.spyOn(window.localStorage.__proto__, 'setItem');
jest.spyOn(window.localStorage.__proto__, 'removeItem');

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
        localStorage.getItem.mockReturnValue('mockToken');
        jwtDecode.mockReturnValue({ uid: '123' });
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
        localStorage.getItem.mockReturnValue('mockToken');
        jwtDecode.mockReturnValue({ uid: '123' });
        render(<App />);
        fireEvent.click(screen.getByText(/logout/i));
        await waitFor(() => {
            expect(localStorage.removeItem).toHaveBeenCalledWith('jwtToken');
        });
    });
});
