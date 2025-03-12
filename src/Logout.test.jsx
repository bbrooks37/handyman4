import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { signOut } from 'firebase/auth';
import Logout from './Logout';
import { auth } from './firebase';

// Mock the Firebase auth module
jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(() => ({ signOut: jest.fn() })),
    signOut: jest.fn()
}));

/**
 * Test suite for the Logout component.
 */
describe('Logout', () => {
    let consoleErrorSpy;

    beforeEach(() => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    /**
     * Test case to check if the logout button is rendered.
     */
    it('renders the logout button', () => {
        render(<Logout />);
        expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });

    /**
     * Test case to check if the user is logged out when the button is clicked.
     */
    it('logs out the user on button click', async () => {
        signOut.mockResolvedValue();

        render(<Logout />);
        fireEvent.click(screen.getByRole('button', { name: /logout/i }));

        expect(signOut).toHaveBeenCalledWith(auth);
        await waitFor(() => {
            expect(console.log).toHaveBeenCalledWith('User logged out');
        });
    });

    /**
     * Test case to check if logout errors are handled correctly.
     */
    it('handles logout errors', async () => {
        const errorMessage = 'Error logging out';
        signOut.mockRejectedValue(new Error(errorMessage));

        render(<Logout />);
        fireEvent.click(screen.getByRole('button', { name: /logout/i }));

        expect(signOut).toHaveBeenCalledWith(auth);
        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith('Error logging out:', new Error(errorMessage));
        });
    });
});
