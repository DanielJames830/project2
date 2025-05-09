import { useUserStore } from '@/stores/user';

export async function fetchExcursions() {
    const userStore = useUserStore();
    const token = userStore.token;
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
    const userStore = useUserStore();
    const token = userStore.token;
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

export async function fetchExcursionById(excursionId) {
    const userStore = useUserStore();
    const token = userStore.token;
    const url = `https://excursions-api-server.azurewebsites.net/excursion/${excursionId}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch excursion by ID');
    }

    return await response.json();
}

export async function updateExcursionById(excursionId, updateData) {

  const data = {
    name: updateData.name,
    description: updateData.description
  }

    const userStore = useUserStore();
    const token = userStore.token;
    const url = `https://excursions-api-server.azurewebsites.net/excursion/${excursionId}`;
    const response = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to update excursion');
    }

    return await response.json();
}

export async function deleteExcursionById(excursionId) {
    const userStore = useUserStore();
    const token = userStore.token;
    const url = `https://excursions-api-server.azurewebsites.net/excursion/${excursionId}`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error('Failed to delete excursion');
    }

    const text = await response.text();
    if (text) {
        return JSON.parse(text);
    }

    return {}
}

export async function shareExcursion(excursionId, inviteData) {
    const userStore = useUserStore();
    const token = userStore.token;
    const url = `https://excursions-api-server.azurewebsites.net/share/excursion/${excursionId}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(inviteData),
    });

    if (!response.ok) {
        throw new Error('Failed to share excursion');
    }

    return await response.json();
}

export async function fetchSharedExcursions() {
    const userStore = useUserStore();
    const token = userStore.token;
    const url = 'https://excursions-api-server.azurewebsites.net/share/excursions';
    const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch shared excursions');
    }

    return await response.json();
}

export async function handleExcursionInvite(inviteId, actionData) {
    const userStore = useUserStore();
    const token = userStore.token;
    const url = `https://excursions-api-server.azurewebsites.net/share/excursions/${inviteId}`;
    const response = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(actionData),
    });

    if (!response.ok) {
        throw new Error('Failed to handle excursion invite');
    }

    return await response.json();
}

export async function deleteExcursionInvite(inviteId) {
    const userStore = useUserStore();
    const token = userStore.token;
    const url = `https://excursions-api-server.azurewebsites.net/share/excursions/${inviteId}`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error('Failed to delete excursion invite');
    }

    return await response.json();
}

export async function removeUserFromExcursion(excursionId) {
    const userStore = useUserStore();
    const token = userStore.token;
    const url = `https://excursions-api-server.azurewebsites.net/remove/excursions/${excursionId}`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error('Failed to remove user from excursion');
    }

    return await response.json();
}

export async function leaveExcursion(excursionId) {
    const userStore = useUserStore();
    const token = userStore.token;
    const url = `https://excursions-api-server.azurewebsites.net/leave/excursions/${excursionId}`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error('Failed to leave excursion');
    }

    return await response.json();
}
