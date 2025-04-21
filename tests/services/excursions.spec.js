import { describe, it, expect, vi, afterEach } from 'vitest';
import * as excursionsService from '@/services/excursions';
import { useUserStore } from '@/stores/user';

vi.mock('@/stores/user', () => ({
    useUserStore: vi.fn(() => ({
        token: 'mock-token',
    })),
}));

global.fetch = vi.fn();

describe('Excursions Service', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('fetchExcursions should send a GET request and return excursions', async () => {
        const mockResponse = { excursions: [{ id: '1', name: 'Excursion 1' }] };
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await excursionsService.fetchExcursions();
        expect(fetch).toHaveBeenCalledWith(
            'https://excursions-api-server.azurewebsites.net/excursions',
            expect.objectContaining({
                method: 'GET',
                headers: { Authorization: 'Bearer mock-token' },
            })
        );
        expect(result).toEqual(mockResponse);
    });

    it('createExcursion should send a POST request and return excursion data', async () => {
        const mockResponse = { id: '1', name: 'Excursion 1' };
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await excursionsService.createExcursion({ name: 'Excursion 1' });
        expect(fetch).toHaveBeenCalledWith(
            'https://excursions-api-server.azurewebsites.net/excursion',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({ name: 'Excursion 1' }),
            })
        );
        expect(result).toEqual(mockResponse);
    });

    it('fetchExcursionById should send a GET request and return excursion data', async () => {
        const mockResponse = { id: '1', name: 'Excursion 1' };
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await excursionsService.fetchExcursionById('1');
        expect(fetch).toHaveBeenCalledWith(
            'https://excursions-api-server.azurewebsites.net/excursion/1',
            expect.objectContaining({
                method: 'GET',
                headers: { Authorization: 'Bearer mock-token' },
            })
        );
        expect(result).toEqual(mockResponse);
    });

    it('updateExcursionById should send a PATCH request and return updated excursion data', async () => {
        const mockResponse = { id: '1', name: 'Updated Excursion' };
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await excursionsService.updateExcursionById('1', { name: 'Updated Excursion' });
        expect(fetch).toHaveBeenCalledWith(
            'https://excursions-api-server.azurewebsites.net/excursion/1',
            expect.objectContaining({
                method: 'PATCH',
                body: JSON.stringify({ name: 'Updated Excursion' }),
            })
        );
        expect(result).toEqual(mockResponse);
    });

    it('deleteExcursionById should send a DELETE request', async () => {
        fetch.mockResolvedValueOnce({ ok: true });

        await excursionsService.deleteExcursionById('1');
        expect(fetch).toHaveBeenCalledWith(
            'https://excursions-api-server.azurewebsites.net/excursion/1',
            expect.objectContaining({
                method: 'DELETE',
                headers: { Authorization: 'Bearer mock-token' },
            })
        );
    });
});
