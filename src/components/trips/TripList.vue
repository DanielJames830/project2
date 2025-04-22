<template>
    <div class="container">
        <h1>Your Trips</h1>
        <div v-if="loading" class="loading">Loading...</div>
        <div v-else-if="trips.length === 0" class="no-results">No trips found.</div>
        <div v-else class="trip-list">
            <TripItem v-for="trip in trips" :key="trip._id" :trip="trip" :formatDate="formatDate"
                @deleted="loadTrips" @updated="loadTrips"/>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchTrips } from '@/services/trips';
import TripItem from './TripItem.vue';

const trips = ref([]);
const loading = ref(true);

async function loadTrips() {
    loading.value = true;
    try {
        const data = await fetchTrips();
        trips.value = data.trips || data;
    } catch {
        trips.value = [];
    }
    loading.value = false;
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString();
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

.loading,
.no-results {
    margin: 2rem 0;
    color: #888;
    text-align: center;
}
</style>
