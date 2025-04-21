import { describe, it, expect, vi, afterEach } from 'vitest';
import * as tripsService from '@/services/trips';
import { useUserStore } from '@/stores/user';

vi.mock('@/stores/user', () => ({
    useUserStore: vi.fn(() => ({
        token: 'mock-token',
    })),
}));

global.fetch = vi.fn();

describe('Trips Service', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('createTrip should send a POST request and return trip data', async () => {
        const mockResponse = { id: '1', name: 'Trip 1' };
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await tripsService.createTrip({ name: 'Trip 1' });
        expect(fetch).toHaveBeenCalledWith(
            'https://excursions-api-server.azurewebsites.net/trip',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({ name: 'Trip 1', description: undefined, startDate: undefined, endDate: undefined, park: undefined, campground: undefined, thingstodo: [] }),
            })
        );
        expect(result).toEqual(mockResponse);
    });

    it('fetchTrips should send a GET request and return trips', async () => {
        const mockResponse = { trips: [{ id: '1', name: 'Trip 1' }] };
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await tripsService.fetchTrips();
        expect(fetch).toHaveBeenCalledWith(
            'https://excursions-api-server.azurewebsites.net/trips',
            expect.objectContaining({
                method: 'GET',
                headers: { Authorization: 'Bearer mock-token' },
            })
        );
        expect(result).toEqual(mockResponse);
    });

    it('fetchTripById should send a GET request and return trip data', async () => {
        const mockResponse = { id: '1', name: 'Trip 1' };
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await tripsService.fetchTripById('1');
        expect(fetch).toHaveBeenCalledWith(
            'https://excursions-api-server.azurewebsites.net/trip/1',
            expect.objectContaining({
                method: 'GET',
                headers: { Authorization: 'Bearer mock-token' },
            })
        );
        expect(result).toEqual(mockResponse);
    });

    it('updateTripById should send a PATCH request and return updated trip data', async () => {
        const mockResponse = { id: '1', name: 'Updated Trip' };
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await tripsService.updateTripById('1', { name: 'Updated Trip' });
        expect(fetch).toHaveBeenCalledWith(
            'https://excursions-api-server.azurewebsites.net/trip/1',
            expect.objectContaining({
                method: 'PATCH',
                body: JSON.stringify({ name: 'Updated Trip' }),
            })
        );
        expect(result).toEqual(mockResponse);
    });

    it('deleteTripById should send a DELETE request', async () => {
        fetch.mockResolvedValueOnce({ ok: true });

        await tripsService.deleteTripById('1');
        expect(fetch).toHaveBeenCalledWith(
            'https://excursions-api-server.azurewebsites.net/trip/1',
            expect.objectContaining({
                method: 'DELETE',
                headers: { Authorization: 'Bearer mock-token' },
            })
        );
    });
});
