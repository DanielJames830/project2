import { describe, beforeAll, test, expect } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useUserStore } from '@/stores/user';
import { login } from '@/services/auth';
import {
    fetchExcursions,
    createExcursion,
    fetchExcursionById,
    updateExcursionById,
    deleteExcursionById,
} from '@/services/excursions';

describe('Excursions service (JS)', () => {
    let userStore;

    beforeAll(async () => {
        setActivePinia(createPinia());
        userStore = useUserStore();

        const creds = { email: 'test@example.com', password: 'mypassword' };
        const { token } = await login(creds);

        userStore.setToken
            ? userStore.setToken(token)
            : (userStore.token = token);
    });

    test('fetchExcursions() returns an array', async () => {
        const list = await fetchExcursions();
        expect(Array.isArray(list)).toBe(true);
    });

    test('create → fetch by ID', async () => {
        const payload = {
            title: 'JS Test Hike',
            description: 'Just a check',
            date: '2025-05-01',
        };
        const created = await createExcursion(payload);
        expect(created).toHaveProperty('id');

        const fetched = await fetchExcursionById(created.id);
        expect(fetched.id).toBe(created.id);
        expect(fetched.title).toBe(payload.title);
    });

    test('updateExcursionById() updates fields', async () => {
        const { id } = await createExcursion({
            title: 'Patch Test',
            description: 'Before',
            date: '2025-06-01',
        });

        const updated = await updateExcursionById(id, { description: 'After' });
        expect(updated.description).toBe('After');
    });

    test('deleteExcursionById() doesn’t throw', async () => {
        const { id } = await createExcursion({
            title: 'Delete Me',
            description: 'Will go away',
            date: '2025-07-01',
        });

        await expect(deleteExcursionById(id)).resolves.not.toThrow();
    });
});
