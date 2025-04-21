<template>
    <div class="container">
        <form>
            <input type="text" v-model="searchQuery" placeholder="Search parks..." @input="debouncedSearch" />
        </form>
        <div class="main-content">

            <div class="parks-container">
                <div v-if="loading" class="loading">Loading...</div>
                <div v-else-if="parks.length === 0" class="no-results">No parks found.</div>
                <div v-else class="parks-list">
                    <div class="park-item" v-for="park in parks" :key="park.id" @click="openDetailsModal(park)">
                        <img :src="park.images[0]?.url" alt="Park Thumbnail" class="thumbnail" />
                        <h2>{{ park.fullName }}</h2>

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
.parks-container {
    max-height: 70vh;
    overflow-y: auto;
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
    margin: 10px;
    max-height: 80vh;
    background: white;
    padding: 2rem;
    border-radius: 10px;
    width: 90%;
    max-width: 500px;
    text-align: center;
    overflow-y: auto;
}

.modal-image {
    width: 100%;
    height: auto;
    margin-bottom: 1rem;
}
</style>
