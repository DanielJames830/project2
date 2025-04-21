import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const token = userStore.token;

export async function signIn(email, password) {
    const url = 'https://excursions-api-server.azurewebsites.net/user/sign-in';
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sign-in failed');
    }

    return await response.json();
}

export async function signOut() {
    const url = 'https://excursions-api-server.azurewebsites.net/user/sign-out';
    const response = await fetch(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error('Failed to sign out');
    }
}

export async function fetchUser() {
    const url = 'https://excursions-api-server.azurewebsites.net/user';
    const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user');
    }

    return await response.json();
}

export async function deleteUser() {
    const url = 'https://excursions-api-server.azurewebsites.net/user';
    const response = await fetch(url, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error('Failed to delete user');
    }
}
