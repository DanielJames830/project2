import { describe, it, expect, vi, afterEach } from 'vitest';
import * as userService from '@/services/users';
import { useUserStore } from '@/stores/user';

vi.mock('@/stores/user', () => ({
    useUserStore: vi.fn(() => ({
        token: 'mock-token',
        $reset: vi.fn(),
    })),
}));

global.fetch = vi.fn();

describe('User Service', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('signIn should send a POST request and return user data', async () => {
        const mockResponse = { email: 'test@example.com', token: 'mock-token' };
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await userService.signIn('test@example.com', 'password');
        expect(fetch).toHaveBeenCalledWith(
            'https://excursions-api-server.azurewebsites.net/user/sign-in',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
            })
        );
        expect(result).toEqual(mockResponse);
    });

    it('signOut should send a POST request', async () => {
        fetch.mockResolvedValueOnce({ ok: true });

        await userService.signOut();
        expect(fetch).toHaveBeenCalledWith(
            'https://excursions-api-server.azurewebsites.net/user/sign-out',
            expect.objectContaining({
                method: 'POST',
                headers: { Authorization: 'Bearer mock-token' },
            })
        );
    });

    it('fetchUser should send a GET request and return user data', async () => {
        const mockResponse = { user: { email: 'test@example.com' } };
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await userService.fetchUser();
        expect(fetch).toHaveBeenCalledWith(
            'https://excursions-api-server.azurewebsites.net/user',
            expect.objectContaining({
                method: 'GET',
                headers: { Authorization: 'Bearer mock-token' },
            })
        );
        expect(result).toEqual(mockResponse);
    });

    it('deleteUser should send a DELETE request', async () => {
        fetch.mockResolvedValueOnce({ ok: true });

        await userService.deleteUser();
        expect(fetch).toHaveBeenCalledWith(
            'https://excursions-api-server.azurewebsites.net/user',
            expect.objectContaining({
                method: 'DELETE',
                headers: { Authorization: 'Bearer mock-token' },
            })
        );
    });

    it('updateUser should send a PATCH request and return updated user data', async () => {
        const mockResponse = { email: 'updated@example.com' };
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await userService.updateUser({ email: 'updated@example.com' });
        expect(fetch).toHaveBeenCalledWith(
            'https://excursions-api-server.azurewebsites.net/user',
            expect.objectContaining({
                method: 'PATCH',
                body: JSON.stringify({ email: 'updated@example.com' }),
            })
        );
        expect(result).toEqual(mockResponse);
    });

    it('fetchUsers should send a GET request and return user list', async () => {
        const mockResponse = { users: [{ email: 'test@example.com' }] };
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await userService.fetchUsers('test');
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('https://excursions-api-server.azurewebsites.net/users?q=test'),
            expect.objectContaining({
                method: 'GET',
                headers: { Authorization: 'Bearer mock-token' },
            })
        );
        expect(result).toEqual(mockResponse);
    });

    it('fetchUserById should send a GET request and return user data', async () => {
        const mockResponse = { user: { email: 'test@example.com' } };
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await userService.fetchUserById('123');
        expect(fetch).toHaveBeenCalledWith(
            'https://excursions-api-server.azurewebsites.net/user/123',
            expect.objectContaining({
                method: 'GET',
                headers: { Authorization: 'Bearer mock-token' },
            })
        );
        expect(result).toEqual(mockResponse);
    });
});
