import { useUserStore } from '@/stores/user';

export async function signUp(data) {
    const url = 'https://excursions-api-server.azurewebsites.net/user';
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sign-up failed');
    }

    return await response.json();
}

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
    const userStore = useUserStore();
    const token = userStore.token;

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
    const userStore = useUserStore();
    const token = userStore.token;

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
    const userStore = useUserStore();
    const token = userStore.token;

    const url = 'https://excursions-api-server.azurewebsites.net/user';
    const response = await fetch(url, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error('Failed to delete user');
    }
}

export async function updateUser(userData) {
    const userStore = useUserStore();
    const token = userStore.token;

    const url = 'https://excursions-api-server.azurewebsites.net/user';
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
    }

    return await response.json();
}

export async function fetchUsers(query = '') {
    const userStore = useUserStore();
    const token = userStore.token;

    const url = new URL('https://excursions-api-server.azurewebsites.net/users');
    if (query) {
        url.searchParams.append('q', query);
    }

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }

    return await response.json();
}

export async function fetchUserById(userId) {
    const userStore = useUserStore();
    const token = userStore.token;

    const url = `https://excursions-api-server.azurewebsites.net/user/${userId}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user by ID');
    }

    return await response.json();
}
