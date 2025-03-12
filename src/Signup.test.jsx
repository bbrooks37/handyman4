import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Signup from './Signup';
import { auth } from './firebase';

// Mock the Firebase auth module
jest.mock('firebase/auth');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
}));

/**
 * Test suite for the Signup component.
 */
describe('Signup', () => {
    const mockedNavigate = jest.fn();
    beforeEach(() => {
        useNavigate.mockReturnValue(mockedNavigate);
        console.error = jest.fn(); // Mock console.error
    });

    /**
     * Test case to check if the signup form is rendered.
     */
    it('renders the signup form', () => {
        render(<Signup />);
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    /**
     * Test case to check if a success message is displayed and navigation occurs on successful signup.
     */
    it('navigates on successful signup', async () => {
        createUserWithEmailAndPassword.mockResolvedValue({ user: { uid: '123' } });
        
        render(<Signup />);
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(mockedNavigate).toHaveBeenCalledWith('/');
        });
    });

    /**
     * Test case to check if the email already in use error is handled correctly.
     */
    it('handles email already in use error', async () => {
        const errorMessage = 'This email address is already registered. Please use a different email or log in.';
        createUserWithEmailAndPassword.mockRejectedValue({ code: 'auth/email-already-in-use' });

        render(<Signup />);
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
    });

    /**
     * Test case to check if other errors are handled correctly.
     */
    it('handles other errors correctly', async () => {
        const errorMessage = 'An unexpected error occurred. Please try again.';
        createUserWithEmailAndPassword.mockRejectedValue(new Error('Test error'));

        render(<Signup />);
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith('Error signing up:', new Error('Test error'));
        });
    });
});
