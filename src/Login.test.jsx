import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Login from './components/Login';
import { auth } from './firebase';

// Mock the Firebase auth module
jest.mock('firebase/auth');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
}));

/**
 * Test suite for the Login component.
 */
describe('Login', () => {
    const mockedNavigate = jest.fn();
    beforeEach(() => {
        useNavigate.mockReturnValue(mockedNavigate);
        console.error = jest.fn(); // Mock console.error
    });

    /**
     * Test case to check if the login form is rendered.
     */
    it('renders the login form', () => {
        render(<Login />);
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    });

    /**
     * Test case to check if a success message is displayed and navigation occurs on successful login.
     */
    it('displays success message and navigates on successful login', async () => {
        signInWithEmailAndPassword.mockResolvedValue({ user: { uid: '123' } });
        
        render(<Login />);
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: /log in/i }));

        await waitFor(() => {
            expect(screen.getByText(/successfully logged in/i)).toBeInTheDocument();
        });

        // Use act to handle state updates and side effects
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1600));
        });

        await waitFor(() => {
            expect(mockedNavigate).toHaveBeenCalledWith('/');
        });
    });

    /**
     * Test case to check if login errors are handled correctly.
     */
    it('handles login errors', async () => {
        const errorMessage = 'Error logging in';
        signInWithEmailAndPassword.mockRejectedValue(new Error(errorMessage));

        render(<Login />);
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: /log in/i }));

        await waitFor(() => {
            expect(screen.queryByText(/successfully logged in/i)).not.toBeInTheDocument();
        });

        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith('Error logging in:', new Error(errorMessage));
        });
    });
});
