<template>
    <div class="container">
        <h1>Your Trips</h1>
        <div v-if="loading" class="loading">Loading...</div>
        <div v-else-if="trips.length === 0" class="no-results">No trips found.</div>
        <div v-else class="trip-list">
            <div class="trip-item" v-for="trip in trips" :key="trip._id" @click="openTrip(trip)">
                <h2>{{ trip.name }}</h2>
                <p>{{ trip.description }}</p>
                <p>
                    <strong>Park:</strong> {{ trip.park?.name || trip.park }}
                    <span v-if="trip.campground">| <strong>Campground:</strong> {{ trip.campground?.name ||
                        trip.campground }}</span>
                </p>
                <p>
                    <strong>Start:</strong> {{ formatDate(trip.startDate) }}<br>
                    <strong>End:</strong> {{ formatDate(trip.endDate) }}
                </p>
            </div>
        </div>
        <TripViewModal v-if="viewTrip" :trip="viewTrip" :park="viewPark" :campground="viewCampground"
            :thingsToDo="viewThingsToDo" @close="viewTrip = null" @delete="deleteTrip" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchTrips, deleteTripById } from '@/services/trips';
import { fetchParks, fetchCampgrounds, fetchThingsToDo } from '@/services/nationalParks';
import TripViewModal from './TripViewModal.vue';

const trips = ref([]);
const loading = ref(true);

const viewTrip = ref(null);
const viewPark = ref(null);
const viewCampground = ref(null);
const viewThingsToDo = ref([]);

async function loadTrips() {
    loading.value = true;
    try {
        const data = await fetchTrips();
        trips.value = data.trips || data;
    } catch (e) {
        trips.value = [];
    }
    loading.value = false;
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleString();
}

async function openTrip(trip) {
    viewTrip.value = trip;
    // Fetch park info
    viewPark.value = null;
    viewCampground.value = null;
    viewThingsToDo.value = [];
    try {
        // Park
        if (trip.park && typeof trip.park === 'string') {
            const parks = await fetchParks();
            viewPark.value = parks.find(p => p.id === trip.park) || { name: trip.park };
        } else if (trip.park && trip.park.name) {
            viewPark.value = trip.park;
        }
        // Campground
        if (trip.campground && typeof trip.campground === 'string') {
            if (viewPark.value && viewPark.value.parkCode) {
                const cgData = await fetchCampgrounds(viewPark.value.parkCode);
                const campgrounds = Array.isArray(cgData.data) ? cgData.data : cgData;
                viewCampground.value = campgrounds.find(cg => cg.id === trip.campground) || { name: trip.campground };
            } else {
                viewCampground.value = { name: trip.campground };
            }
        } else if (trip.campground && trip.campground.name) {
            viewCampground.value = trip.campground;
        }
        // Things to do
        if (Array.isArray(trip.thingstodo) && trip.thingstodo.length > 0 && viewPark.value && viewPark.value.parkCode) {
            const ttdData = await fetchThingsToDo(viewPark.value.parkCode);
            const ttdList = Array.isArray(ttdData.data) ? ttdData.data : ttdData;
            viewThingsToDo.value = trip.thingstodo
                .map(id => ttdList.find(t => t.id === id) || { id, title: id });
        }
    } catch (e) {
        viewPark.value = trip.park;
        viewCampground.value = trip.campground;
        viewThingsToDo.value = Array.isArray(trip.thingstodo)
            ? trip.thingstodo.map(id => ({ id, title: id }))
            : [];
    }
}

async function deleteTrip(trip) {
    if (!trip || !trip._id) return;
    try {
        await deleteTripById(trip._id);
        viewTrip.value = null;
        await loadTrips();
    } catch (e) {
        alert('Failed to delete trip.');
    }
}

onMounted(loadTrips);
</script>

<style scoped>
.container {
    background-color: white;
    padding: 2rem;
    border-radius: 30px;
}

.trip-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.trip-item {
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 1rem;
    cursor: pointer;
    background: #f8f8f8;
    transition: background 0.2s;
}

.trip-item:hover {
    background: #ffe6b0;
}

.loading,
.no-results {
    margin: 2rem 0;
    color: #888;
    text-align: center;
}
</style>
