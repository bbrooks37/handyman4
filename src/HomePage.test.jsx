import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import HomePage from './HomePage';

// Mock the image import
jest.mock('./BB handyman.jpg', () => 'handymanLogo');

/**
 * Test suite for the HomePage component.
 */
describe('HomePage', () => {

    /**
     * Test case to check if the hero section is rendered correctly.
     */
    it('renders the hero section', () => {
        render(
            <Router>
                <HomePage />
            </Router>
        );
        expect(screen.getByAltText(/bb handyman logo/i)).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /your trusted partner for yard repairs and cleanups/i })).toBeInTheDocument();
        expect(screen.getByText(/we provide reliable and high-quality handyman services/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /see our services/i })).toBeInTheDocument();
    });

    /**
     * Test case to check if the services section is rendered correctly.
     */
    it('renders the services section', () => {
        render(
            <Router>
                <HomePage />
            </Router>
        );
        expect(screen.getByRole('heading', { name: /our services/i })).toBeInTheDocument();

        const yardCleanup = screen.getByRole('heading', { name: /yard cleanup's/i }).closest('.service-item');
        expect(within(yardCleanup).getByText(/trimming trees, pressure washing/i)).toBeInTheDocument();
        expect(within(yardCleanup).getByRole('link', { name: /learn more/i })).toHaveAttribute('href', '/services/Yard%20Work');

        const moving = screen.getByRole('heading', { name: /moving/i }).closest('.service-item');
        expect(within(moving).getByText(/small moves, trash or junk removal/i)).toBeInTheDocument();
        expect(within(moving).getByRole('link', { name: /learn more/i })).toHaveAttribute('href', '/services/Moving');

        const mulching = screen.getByRole('heading', { name: /mulching/i }).closest('.service-item');
        expect(within(mulching).getByText(/lay down mulch by the sq foot/i)).toBeInTheDocument();
        expect(within(mulching).getByRole('link', { name: /learn more/i })).toHaveAttribute('href', '/services/Mulching');

        const handyServices = screen.getByRole('heading', { name: /handy services/i }).closest('.service-item');
        expect(within(handyServices).getByText(/change out light bulbs, clean cowebs/i)).toBeInTheDocument();
        expect(within(handyServices).getByRole('link', { name: /learn more/i })).toHaveAttribute('href', '/services/Handy%20Services');
    });

    /**
     * Test case to check if the call-to-action section is rendered correctly.
     */
    it('renders the call-to-action section', () => {
        render(
            <Router>
                <HomePage />
            </Router>
        );
        expect(screen.getByRole('heading', { name: /ready to get started/i })).toBeInTheDocument();
        expect(screen.getByText(/contact us today for a free estimate/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /contact us: 813-503-5735/i })).toHaveAttribute('href', '#contact');
    });
});
