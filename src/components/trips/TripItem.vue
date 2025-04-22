<template>
    <div class="trip-item" @click="openModal">
        <h2>{{ trip.name }}</h2>
        <p>{{ trip.description }}</p>
        <p>
            <strong>Park:</strong> {{ trip.park?.name || trip.park }}
            <span v-if="trip.campground">|
                <strong>Campground:</strong>
                {{ trip.campground?.name || trip.campground }}
            </span>
        </p>
        <p>
            <strong>Start:</strong> {{ formatDate(trip.startDate) }}<br>
            <strong>End:</strong> {{ formatDate(trip.endDate) }}
        </p>
    </div>


    <TripViewModal v-if="isModalOpen" :trip="trip" :park="viewPark" :campground="viewCampground"
        :thingsToDo="viewThingsToDo" @close="closeModal" @delete="handleDelete" />

</template>

<script setup>
import { ref } from 'vue';
import { fetchParks, fetchCampgrounds, fetchThingsToDo } from '@/services/nationalParks';
import { deleteTripById } from '@/services/trips';
import TripViewModal from './TripViewModal.vue';
import TripEditModal from './TripEditModal.vue';

const props = defineProps({
    trip: { type: Object, required: true },
    formatDate: { type: Function, required: true },
});
const emit = defineEmits(['deleted']);



const isModalOpen = ref(false);
const viewPark = ref(null);
const viewCampground = ref(null);
const viewThingsToDo = ref([]);

async function openModal() {
    viewPark.value = null;
    viewCampground.value = null;
    viewThingsToDo.value = [];

    try {
        if (props.trip.park && typeof props.trip.park === 'string') {
            const parks = await fetchParks();
            viewPark.value = parks.find(p => p.id === props.trip.park) || { name: props.trip.park };
        } else if (props.trip.park && props.trip.park.name) {
            viewPark.value = props.trip.park;
        }

        if (props.trip.campground && typeof props.trip.campground === 'string') {
            if (viewPark.value && viewPark.value.parkCode) {
                const cgData = await fetchCampgrounds(viewPark.value.parkCode);
                const campgrounds = Array.isArray(cgData.data) ? cgData.data : cgData;
                viewCampground.value = campgrounds.find(cg => cg.id === props.trip.campground) || { name: props.trip.campground };
            } else {
                viewCampground.value = { name: props.trip.campground };
            }
        } else if (props.trip.campground && props.trip.campground.name) {
            viewCampground.value = props.trip.campground;
        }

        if (Array.isArray(props.trip.thingstodo) && props.trip.thingstodo.length && viewPark.value && viewPark.value.parkCode) {
            const ttdData = await fetchThingsToDo(viewPark.value.parkCode);
            const ttdList = Array.isArray(ttdData.data) ? ttdData.data : ttdData;
            viewThingsToDo.value = props.trip.thingstodo.map(id => ttdList.find(t => t.id === id) || { id, title: id });
        }
    } catch {
        // fallback to raw values
        viewPark.value = props.trip.park;
        viewCampground.value = props.trip.campground;
        viewThingsToDo.value = Array.isArray(props.trip.thingstodo)
            ? props.trip.thingstodo.map(id => ({ id, title: id }))
            : [];
    }

    isModalOpen.value = true;
}

function closeModal() {
    isModalOpen.value = false;
}

async function handleDelete() {
    try {
        await deleteTripById(props.trip._id);
        closeModal();
        emit('deleted', props.trip);
    } catch {
        alert('Failed to delete trip.');
    }
}
</script>

<style scoped>
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
</style>