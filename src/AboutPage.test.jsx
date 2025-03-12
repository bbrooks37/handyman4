import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Ensure this import is correct
import AboutPage from './AboutPage';

/**
 * Test suite for the AboutPage component.
 */
describe('AboutPage', () => {

    /**
     * Test case to check if the main elements of the about page are rendered.
     */
    it('renders the component', () => {
        render(<AboutPage />);
        // Check if main elements are present
        expect(screen.getByRole('heading', { name: /about brandon brooks/i })).toBeInTheDocument();
        expect(screen.getByRole('img', { name: /brandon brooks/i })).toBeInTheDocument();
        expect(screen.getByText(/owner and operator of brandon brooks handyman services/i)).toBeInTheDocument();
    });

    /**
     * Test case to check if the correct profile image is displayed.
     */
    it('displays the correct profile image', () => {
        render(<AboutPage />);
        const profileImage = screen.getByRole('img', { name: /brandon brooks/i });
        expect(profileImage).toHaveAttribute('src', '/BB handyman.jpg');
        expect(profileImage).toHaveAttribute('alt', 'Brandon Brooks');
    });

    /**
     * Test case to check if the introductory text is rendered correctly.
     */
    it('renders the correct introductory text', () => {
        render(<AboutPage />);
        expect(screen.getByText(/hello! i'm brandon brooks/i)).toBeInTheDocument();
    });

    /**
     * Test case to check if the information about experience is rendered.
     */
    it('renders the information about experience', () => {
        render(<AboutPage />);
        expect(screen.getByText(/with years of experience in yard repairs and maintenance/i)).toBeInTheDocument();
    });

    /**
     * Test case to check if the information about the goal is rendered.
     */
    it('renders the information about the goal', () => {
        render(<AboutPage />);
        expect(screen.getByText(/my goal is to make your life easier/i)).toBeInTheDocument();
    });

    /**
     * Test case to check if the information about passion and community is rendered.
     */
    it('renders the information about passion and community', () => {
        render(<AboutPage />);
        expect(screen.getByText(/i'm passionate about serving my local community/i)).toBeInTheDocument();
    });

    /**
     * Test case to check if the weekend availability information is rendered.
     */
    it('renders the weekend availability information', () => {
        render(<AboutPage />);
        expect(screen.getByText(/weekend availability/i)).toBeInTheDocument();
        expect(screen.getByText(/we are available for appointments on saturdays and sundays/i)).toBeInTheDocument();
    });
});
