import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactPage from './components/ContactPage';

/**
 * Test suite for the ContactPage component.
 */
describe('ContactPage', () => {

    /**
     * Test case to check if the main elements of the contact page are rendered.
     */
    it('renders the component', () => {
        render(<ContactPage />);
        // Check if main elements are present
        expect(screen.getByRole('heading', { name: /contact us/i })).toBeInTheDocument();
        expect(screen.getByText(/we're here to help with all your handyman needs in lakeland, florida/i)).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /contact information/i })).toBeInTheDocument();
    });

    /**
     * Test case to check if the phone number is rendered correctly.
     */
    it('renders the phone number correctly', () => {
        render(<ContactPage />);
        // Check if the phone number is in the document
        expect(screen.getByText((content, element) => {
            const hasText = (text) => text.match(/phone:\s*813-503-5735/i);
            const elementHasText = hasText(element.textContent);
            const childrenDontHaveText = Array.from(element.children).every(child => !hasText(child.textContent));
            return elementHasText && childrenDontHaveText;
        })).toBeInTheDocument();
    });

    /**
     * Test case to check if the contact form fields are rendered.
     */
    it('renders the contact form fields', () => {
        render(<ContactPage />);
        // Check if form fields are present
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    });
});
