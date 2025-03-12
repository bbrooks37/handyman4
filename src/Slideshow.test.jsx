import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Slideshow from './Slideshow';

/**
 * Test suite for the Slideshow component.
 */
describe('Slideshow', () => {

    /**
     * Test case to check if the initial images are rendered correctly.
     */
    it('renders the initial images correctly', () => {
        render(<Slideshow />);
        expect(screen.getByLabelText(/before image of 1/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/after image of 1/i)).toBeInTheDocument();
    });

    /**
     * Test case to check if the next button works correctly.
     */
    it('changes to the next images when the Next button is clicked', () => {
        render(<Slideshow />);
        fireEvent.click(screen.getByRole('button', { name: /next/i }));
        expect(screen.getByLabelText(/before image of 2/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/after image of 2/i)).toBeInTheDocument();
    });

    /**
     * Test case to check if the previous button works correctly.
     */
    it('changes to the previous images when the Previous button is clicked', () => {
        render(<Slideshow />);
        fireEvent.click(screen.getByRole('button', { name: /previous/i }));
        expect(screen.getByLabelText(/before image of 8/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/after image of 8/i)).toBeInTheDocument();
    });

    /**
     * Test case to check if the slideshow cycles back to the first images after the last image.
     */
    it('cycles back to the first images after the last image', () => {
        render(<Slideshow />);
        for (let i = 0; i < 8; i++) {
            fireEvent.click(screen.getByRole('button', { name: /next/i }));
        }
        expect(screen.getByLabelText(/before image of 1/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/after image of 1/i)).toBeInTheDocument();
    });

    /**
     * Test case to check if the slideshow cycles back to the last images after the first image.
     */
    it('cycles back to the last images after the first image', () => {
        render(<Slideshow />);
        fireEvent.click(screen.getByRole('button', { name: /previous/i }));
        expect(screen.getByLabelText(/before image of 8/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/after image of 8/i)).toBeInTheDocument();
    });
});
