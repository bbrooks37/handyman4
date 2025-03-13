import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Account from './components/Account';
import Slideshow from './components/Slideshow';
import { AuthContext } from './contexts/AuthContext'; // Adjust path as needed

// Mock the Auth Context and the Slideshow component
jest.mock('../contexts/AuthContext', () => ({
    AuthContext: {
        Provider: ({ children, value }) => <>{children}</>,
    },
    useAuth: jest.fn(),
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
        useAuth.mockReturnValue({ currentUser: null, loading: true }); // Mock loading state
        render(
            <AuthContext.Provider value={{ currentUser: null, loading: true }}>
                <Account />
            </AuthContext.Provider>
        );
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    /**
     * Test case to check if the login prompt is displayed when the user is not logged in.
     */
    it('displays login prompt when user is not logged in', () => {
        useAuth.mockReturnValue({ currentUser: null, loading: false }); // Mock not logged in state
        render(
            <AuthContext.Provider value={{ currentUser: null, loading: false }}>
                <Account />
            </AuthContext.Provider>
        );
        expect(screen.getByText(/please log in to view your account/i)).toBeInTheDocument();
    });

    /**
     * Test case to check if account details are displayed when the user is logged in.
     */
    it('displays account details when user is logged in', async () => {
        const user = { email: 'test@example.com' };
        useAuth.mockReturnValue({ currentUser: user, loading: false }); // Mock logged in state
        
        // Mock the fetch call (if your component fetches data)
        const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
            json: () => Promise.resolve({ email: 'test@example.com' }), // Mock the response data
            ok: true, // Indicate a successful response
        });

        render(
            <AuthContext.Provider value={{ currentUser: user, loading: false }}>
                <Account />
            </AuthContext.Provider>
        );

        // Wait for the fetch to resolve and the component to update
        await waitFor(() => {
            expect(screen.getByText(/account details/i)).toBeInTheDocument();
            expect(screen.getByText(/email:/i)).toBeInTheDocument();
            expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
            expect(screen.getByText(/slideshow component/i)).toBeInTheDocument();
        });

        fetchMock.mockRestore(); // Restore the original fetch
    });
});