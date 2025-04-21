import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const token = userStore.token;

export async function fetchExcursions() {
    const url = 'https://excursions-api-server.azurewebsites.net/excursions';
    const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch excursions');
    }

    return await response.json();
}

export async function createExcursion(excursionData) {
    const url = 'https://excursions-api-server.azurewebsites.net/excursion';
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(excursionData),
    });

    if (!response.ok) {
        throw new Error('Failed to create excursion');
    }

    return await response.json();
}
