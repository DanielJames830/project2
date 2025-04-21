import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const token = userStore.token;

export async function createTrip(tripData) {
    const url = "https://excursions-api-server.azurewebsites.net/trip";

    const payload = {
        name: tripData.name,
        description: tripData.description,
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        park: tripData.park,
        campground: tripData.campground,
        thingstodo: tripData.thingstodo || []
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Error creating trip:', errorData.message || response.statusText);
        throw new Error(errorData.message || 'Failed to create trip');
    }

    return await response.json();
}
