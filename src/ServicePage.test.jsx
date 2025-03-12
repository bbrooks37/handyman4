import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import ServicePage from './ServicePage';

// Mock the axios module
jest.mock('axios');

// Mock Modal from react-modal
jest.mock('react-modal', () => {
    const ReactModal = ({ isOpen, onRequestClose, style, contentLabel, children }) => {
        if (!isOpen) return null;
        return (
            <div style={style.content} aria-label={contentLabel} role="dialog">
                {children}
                <button onClick={onRequestClose}>Close</button>
            </div>
        );
    };
    return ReactModal;
});

/**
 * Test suite for the ServicePage component.
 */
describe('ServicePage', () => {

    /**
     * Test case to check if the loading state is displayed.
     */
    it('displays loading state', async () => {
        await act(async () => {
            render(
                <MemoryRouter initialEntries={['/service/Yard Work']}>
                    <Routes>
                        <Route path="/service/:serviceName" element={<ServicePage />} />
                    </Routes>
                </MemoryRouter>
            );
        });
        expect(screen.getByText(/loading service details/i)).toBeInTheDocument();
    });

    /**
     * Test case to check if the error state is displayed.
     */
    it('displays error state on API error', async () => {
        axios.get.mockRejectedValueOnce({ response: { status: 404, data: { error: 'Not Found' } } });

        await act(async () => {
            render(
                <MemoryRouter initialEntries={['/service/Yard Work']}>
                    <Routes>
                        <Route path="/service/:serviceName" element={<ServicePage />} />
                    </Routes>
                </MemoryRouter>
            );
        });

        await waitFor(() => {
            expect(screen.getByText(/api error: 404 - not found/i)).toBeInTheDocument();
        });
    });

    /**
     * Test case to check if services are displayed correctly.
     */
    it('displays services correctly', async () => {
        const servicesData = [
            { id: 1, service_name: 'Lawn Mowing', price: 50, duration: 'Full Day' },
            { id: 2, service_name: 'Yard Work', price: 30, duration: 'Half Day' }
        ];
        axios.get.mockResolvedValueOnce({ data: servicesData });

        await act(async () => {
            render(
                <MemoryRouter initialEntries={['/service/Yard Work']}>
                    <Routes>
                        <Route path="/service/:serviceName" element={<ServicePage />} />
                    </Routes>
                </MemoryRouter>
            );
        });

        await waitFor(() => {
            expect(screen.getByText(/lawn mowing/i)).toBeInTheDocument();
            expect(screen.getByText(/yard work - half day/i)).toBeInTheDocument();
            expect(screen.getByText(/price: \$50/i)).toBeInTheDocument();
            expect(screen.getByText(/price: \$30/i)).toBeInTheDocument();
        });
    });

    /**
     * Test case to check if the modal opens with the correct service details when 'Request a Quote' is clicked.
     */
    it('opens modal with correct service details on "Request a Quote" button click', async () => {
        const servicesData = [
            { id: 1, service_name: 'Lawn Mowing', price: 50, duration: 'Full Day' },
        ];
        axios.get.mockResolvedValueOnce({ data: servicesData });

        await act(async () => {
            render(
                <MemoryRouter initialEntries={['/service/Yard Work']}>
                    <Routes>
                        <Route path="/service/:serviceName" element={<ServicePage />} />
                    </Routes>
                </MemoryRouter>
            );
        });

        await waitFor(() => {
            expect(screen.getByText(/lawn mowing/i)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText(/request a quote/i));

        await waitFor(() => {
            expect(screen.getByRole('dialog', { name: /request a quote/i })).toBeInTheDocument();
            expect(screen.getByText(/service: lawn mowing/i)).toBeInTheDocument();
            expect(screen.getByText(/price: \$50/i)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText(/close/i));
        await waitFor(() => {
            expect(screen.queryByRole('dialog', { name: /request a quote/i })).not.toBeInTheDocument();
        });
    });
});
