<template>
    <div class="page">
        <TitleBar title="Trips" subtitle="Manage your trips" />
        <button class="floating-action-button" @click="openNewTripModal">+</button>
        <div class="container">
            <h1>Trips</h1>
            <p>Plan your adventures!</p>
            <div class="trip-list">
                <TripItem v-for="trip in trips" :key="trip.id" :trip="trip" @view-details="openTripDetails" />
            </div>
        </div>
        <TripDetailsModal v-if="selectedTrip" :trip="selectedTrip" @close="selectedTrip = null" @update="updateTrip"
            @delete="deleteTrip" />
        <TripDetailsModal v-if="showNewTripModal" :trip="newTrip" new @close="closeNewTripModal"
            @update="createdTrip" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TitleBar from '@/components/TitleBar.vue';
import TripItem from './TripItem.vue';
import TripDetailsModal from './TripDetailsModal.vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const token = userStore.token;


const showNewTripModal = ref(false);
const newTrip = ref({
    name: '',
    description: '',
    dates: []
});

async function getTrips() {
    const url = "https://excursions-api-server.azurewebsites.net/trips";
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        console.error('Error fetching trips:', response.statusText);
        return;
    }

    const data = await response.json();

    return data;
}

const trips = ref([]);
const selectedTrip = ref(null);

async function fetchTrips() {
    const data = await getTrips();
    console.log('Fetched trips:', JSON.stringify(data));
    if (data) {
        trips.value = data;
    }

}

onMounted(() => {
    fetchTrips();
});

function createdTrip() {
    closeNewTripModal();
    fetchTrips();
}

async function deleteTrip() {
    selectedTrip.value = null;
    await fetchTrips();
}

function openTripDetails(trip) {
    selectedTrip.value = { ...trip };
}

function updateTrip(updatedTrip) {
    const index = trips.value.findIndex(t => t.id === updatedTrip.id);
    if (index !== -1) {
        trips.value[index] = updatedTrip;
    }
    selectedTrip.value = null;
}

function openNewTripModal() {
    newTrip.value = {
        name: '',
        description: '',
        dates: []
    };
    showNewTripModal.value = true;
}

function closeNewTripModal() {
    showNewTripModal.value = false;
}
</script>

<style scoped>
.container {
    background-color: white;
    padding: 2rem;
    border-radius: 30px;
}

.floating-action-button {
    font-size: xx-large;
    border-radius: 100%;
    width: 60px;
    height: 60px;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #FFC15E;
    font-weight: bold;
    position: fixed;
    right: 20px;
    bottom: 120px;
    box-shadow: 0px 3px 0px rgba(0, 0, 0, 0.566);
    z-index: 1000;
    padding: 20px;
}
</style>
