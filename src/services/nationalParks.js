import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const token = userStore.token;

export async function fetchParks(query = '') {
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
