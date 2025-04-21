<template>
    <div class="page">
        <TitleBar title="Parks" subtitle="Explore National Parks" />
        <div class="main-content">
            <div class="search-container">
                <input type="text" v-model="searchQuery" placeholder="Search parks..." @input="debouncedSearch" />
            </div>
            <div class="parks-container">
                <div v-if="loading" class="loading">Loading...</div>
                <div v-else-if="parks.length === 0" class="no-results">No parks found.</div>
                <div v-else class="parks-list">
                    <div class="park-item" v-for="park in parks" :key="park.id" @click="openDetailsModal(park)">
                        <img :src="park.images[0]?.url" alt="Park Thumbnail" class="thumbnail" />
                        <h2>{{ park.fullName }}</h2>
                        <p>{{ park.description }}</p>
                    </div>
                </div>
            </div>
            <div v-if="showDetailsModal" class="modal-overlay" @click.self="closeDetailsModal">
                <div class="modal-content">
                    <h2>{{ selectedPark.fullName }}</h2>
                    <img :src="selectedPark.images[0]?.url" alt="Park Image" class="modal-image" />
                    <p>{{ selectedPark.description }}</p>
                    <p><strong>Activities:</strong> {{selectedPark.activities.map(a => a.name).join(', ')}}</p>
                    <p><strong>Topics:</strong> {{selectedPark.topics.map(t => t.name).join(', ')}}</p>
                    <p><strong>Directions:</strong> {{ selectedPark.directionsInfo }}</p>
                    <button @click="openCreateTripModal">Create Trip</button>
                    <button @click="closeDetailsModal">Close</button>
                </div>
            </div>
            <TripDetailsModal v-if="showCreateTripModal" :trip="newTrip" new @close="closeCreateTripModal"
                @update="submitTripForm" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import TitleBar from '@/components/TitleBar.vue';
import { fetchParks } from '@/services/nationalParks';
import { createTrip } from '@/services/trips';
import TripDetailsModal from '@/components/trips/TripDetailsModal.vue';

const searchQuery = ref('');
const parks = ref([]);
const loading = ref(false);
const debounceTimeout = ref(null);

const showDetailsModal = ref(false);
const selectedPark = ref(null);

const showCreateTripModal = ref(false);
const newTrip = ref({
    name: '',
    description: '',
    park: null
});

async function loadParks(query = '') {
    loading.value = true;
    parks.value = await fetchParks(query);
    loading.value = false;
}

function debouncedSearch() {
    clearTimeout(debounceTimeout.value);
    debounceTimeout.value = setTimeout(() => {
        loadParks(searchQuery.value);
    }, 300);
}

function openDetailsModal(park) {
    selectedPark.value = park;
    showDetailsModal.value = true;
}

function closeDetailsModal() {
    showDetailsModal.value = false;
}

function openCreateTripModal() {
    newTrip.value = {
        name: '',
        description: '',
        park: selectedPark.value
    };
    showCreateTripModal.value = true;
}

function closeCreateTripModal() {
    showCreateTripModal.value = false;
}

async function submitTripForm(updatedTrip) {
    try {
        await createTrip({
            name: updatedTrip.name,
            description: updatedTrip.description,
            startDate: updatedTrip.startDate,
            endDate: updatedTrip.endDate,
            park: selectedPark.value.id,
            campground: updatedTrip.campground || null,
            thingstodo: updatedTrip.thingstodo || []
        });
        closeCreateTripModal();
    } catch (error) {
        console.error('Error creating trip:', error.message);
    }
}

loadParks();
</script>

<style scoped>
.main-content {
    display: flex;
    flex-direction: column;
    align-content: center;
    align-items: center;
    flex: 1;
    overflow-y: auto;
    justify-content: center;
}

.search-container {
    width: 500px;
    text-align: center;
}

.search-container input {
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.parks-container {
    margin-top: 1rem;
}

.loading {
    text-align: center;
    font-size: 1.2rem;
    color: #555;
}

.no-results {
    text-align: center;
    font-size: 1.2rem;
    color: #777;
}

.parks-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
}

.park-item {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 1rem;
    width: 500px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    text-align: center;
}

.park-item img.thumbnail {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 0.5rem;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
}

.modal-content {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    overflow: auto;
    text-align: center;
}

.modal-content img.modal-image {
    width: 100%;
    height: auto;
    border-radius: 10px;
    margin-bottom: 1rem;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 0.5rem;
    box-sizing: border-box;
}
</style>
