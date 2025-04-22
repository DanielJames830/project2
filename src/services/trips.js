import { useUserStore } from '@/stores/user';

export async function createTrip(tripData) {

    const data = {
        name: tripData.name,
        description: tripData.description,
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        park: tripData.park.id,
        thingstodo: tripData.thingstodo?.map(item => item.id) || []
    };

    if (tripData.campground) {
        data.campground = tripData.campground.id;
    }

    console.log(JSON.stringify(data));


    const userStore = useUserStore();
    const token = userStore.token;

    const url = "https://excursions-api-server.azurewebsites.net/trip";



    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Error creating trip:', errorData.message || response.statusText);
        throw new Error(errorData.message || 'Failed to create trip');
    }

    return await response.json();
}

export async function fetchTrips() {
    const userStore = useUserStore();
    const token = userStore.token;

    const url = 'https://excursions-api-server.azurewebsites.net/trips';
    const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch trips');
    }

    return await response.json();
}

export async function fetchTripById(tripId) {
    const userStore = useUserStore();
    const token = userStore.token;

    const url = `https://excursions-api-server.azurewebsites.net/trip/${tripId}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch trip by ID');
    }

    return await response.json();
}

export async function updateTripById(tripId, tripData) {


    const data = {
      name: tripData.name,
      description: tripData.description,
      startDate: tripData.startDate,
      endDate: tripData.endDate,
    }

    console.log(JSON.stringify(data))

    const userStore = useUserStore();
    const token = userStore.token;

    const url = `https://excursions-api-server.azurewebsites.net/trip/${tripId}`;
    const response = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to update trip');
    }

    return await response.json();
}

export async function deleteTripById(tripId) {
    console.log(tripId);
    const userStore = useUserStore();
    const token = userStore.token;

    const url = `https://excursions-api-server.azurewebsites.net/trip/${tripId}`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error('Failed to delete trip');
    }


    const text = await response.text();
    if (text) {
        return JSON.parse(text);
    }
    return {};
}
