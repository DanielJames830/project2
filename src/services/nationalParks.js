import { useUserStore } from '@/stores/user';

export async function fetchParks(query = '') {
    const userStore = useUserStore();
    const token = userStore.token;

    const url = new URL('https://excursions-api-server.azurewebsites.net/national-parks');
    url.searchParams.append('limit', 10);
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
        console.error('Error fetching parks:', response.statusText);
        return [];
    }

    const data = await response.json();
    return data.data || [];
}

export async function fetchParkSummaries(query = '') {
    const userStore = useUserStore();
    const token = userStore.token;

    const url = new URL('https://excursions-api-server.azurewebsites.net/national-parks/summary');
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
        throw new Error('Failed to fetch park summaries');
    }

    return await response.json();
}

export async function fetchParkCodes() {
    const userStore = useUserStore();
    const token = userStore.token;

    const url = 'https://excursions-api-server.azurewebsites.net/national-parks/codes';
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch park codes');
    }

    return await response.json();
}

export async function fetchCampgrounds(query = '') {
    const userStore = useUserStore();
    const token = userStore.token;

    const url = new URL('https://excursions-api-server.azurewebsites.net/campgrounds');
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
        throw new Error('Failed to fetch campgrounds');
    }

    return await response.json();
}

export async function fetchThingsToDo(query = '') {
    const userStore = useUserStore();
    const token = userStore.token;

    const url = new URL('https://excursions-api-server.azurewebsites.net/things-to-do');
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
        throw new Error('Failed to fetch things to do');
    }

    return await response.json();
}
