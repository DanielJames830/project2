import { describe, it, expect, vi, afterEach } from 'vitest';
import * as parksService from '@/services/nationalParks';
import { useUserStore } from '@/stores/user';

vi.mock('@/stores/user', () => ({
    useUserStore: vi.fn(() => ({
        token: 'mock-token',
    })),
}));

global.fetch = vi.fn();

describe('National Parks Service', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('fetchParks should send a GET request and return parks', async () => {
        const mockResponse = { data: [{ id: '1', name: 'Park 1' }] };
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await parksService.fetchParks('query');
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('https://excursions-api-server.azurewebsites.net/national-parks?q=query'),
            expect.objectContaining({
                method: 'GET',
                headers: { Authorization: 'Bearer mock-token' },
            })
        );
        expect(result).toEqual(mockResponse.data);
    });

    it('fetchParkSummaries should send a GET request and return park summaries', async () => {
        const mockResponse = [{ id: '1', name: 'Summary 1' }];
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await parksService.fetchParkSummaries('query');
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('https://excursions-api-server.azurewebsites.net/national-parks/summary?q=query'),
            expect.objectContaining({
                method: 'GET',
                headers: { Authorization: 'Bearer mock-token' },
            })
        );
        expect(result).toEqual(mockResponse);
    });

    it('fetchParkCodes should send a GET request and return park codes', async () => {
        const mockResponse = ['CODE1', 'CODE2'];
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await parksService.fetchParkCodes();
        expect(fetch).toHaveBeenCalledWith(
            'https://excursions-api-server.azurewebsites.net/national-parks/codes',
            expect.objectContaining({
                method: 'GET',
                headers: { Authorization: 'Bearer mock-token' },
            })
        );
        expect(result).toEqual(mockResponse);
    });

    it('fetchCampgrounds should send a GET request and return campgrounds', async () => {
        const mockResponse = [{ id: '1', name: 'Campground 1' }];
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await parksService.fetchCampgrounds('query');
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('https://excursions-api-server.azurewebsites.net/campgrounds?q=query'),
            expect.objectContaining({
                method: 'GET',
                headers: { Authorization: 'Bearer mock-token' },
            })
        );
        expect(result).toEqual(mockResponse);
    });

    it('fetchThingsToDo should send a GET request and return things to do', async () => {
        const mockResponse = [{ id: '1', name: 'Activity 1' }];
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await parksService.fetchThingsToDo('query');
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('https://excursions-api-server.azurewebsites.net/things-to-do?q=query'),
            expect.objectContaining({
                method: 'GET',
                headers: { Authorization: 'Bearer mock-token' },
            })
        );
        expect(result).toEqual(mockResponse);
    });
});
