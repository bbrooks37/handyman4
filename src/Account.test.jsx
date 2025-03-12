import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import Account from './Account';
import Slideshow from './Slideshow';

// Mock the useAuthState hook and the Slideshow component
jest.mock('react-firebase-hooks/auth', () => ({
    useAuthState: jest.fn(),
}));
jest.mock('./Slideshow', () => () => <div>Slideshow Component</div>);

/**
 * Test suite for the Account component.
 */
describe('Account', () => {

    /**
     * Test case to check if the loading state is displayed.
     */
    it('displays loading state', () => {
        useAuthState.mockReturnValue([null, true, null]); // Mock loading state
        render(<Account />);
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    /**
     * Test case to check if the error state is displayed.
     */
    it('displays error state', () => {
        const error = new Error('Test error');
        useAuthState.mockReturnValue([null, false, error]); // Mock error state
        render(<Account />);
        expect(screen.getByText(/error: test error/i)).toBeInTheDocument();
    });

    /**
     * Test case to check if the login prompt is displayed when the user is not logged in.
     */
    it('displays login prompt when user is not logged in', () => {
        useAuthState.mockReturnValue([null, false, null]); // Mock not logged in state
        render(<Account />);
        expect(screen.getByText(/please log in to view your account/i)).toBeInTheDocument();
    });

    /**
     * Test case to check if account details are displayed when the user is logged in.
     */
    it('displays account details when user is logged in', () => {
        const user = { email: 'test@example.com' };
        useAuthState.mockReturnValue([user, false, null]); // Mock logged in state
        render(<Account />);
        expect(screen.getByText(/account details/i)).toBeInTheDocument();
        expect(screen.getByText(/email:/i)).toBeInTheDocument();
        expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
        expect(screen.getByText(/slideshow component/i)).toBeInTheDocument();
    });
});
