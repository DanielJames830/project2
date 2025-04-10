<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
            <h2 v-if="!isEditing">{{ excursion.name }}</h2>
            <div v-else>
                <label for="name">Name</label>
                <input id="name" v-model="editableExcursion.name" />
            </div>

            <p v-if="!isEditing">{{ excursion.description }}</p>
            <div v-else>
                <label for="description">Description</label>
                <textarea id="description" v-model="editableExcursion.description"></textarea>
            </div>

            <h3>Trips</h3>
            <div class="trip-list">
                <TripCard v-for="(trip, index) in editableExcursion.trips" :key="trip.id || index" :trip="trip"
                    :is-editing="isEditing" @remove="removeTrip(index)" />
            </div>

            <div class="modal-actions">
                <!-- For existing excursions: show edit/save and delete options -->
                <button v-if="!props.new && !isEditing" @click="enableEditing">Edit</button>
                <button v-if="!props.new && isEditing" @click="saveChanges">Save</button>
                <button v-if="!props.new" @click="deleteExcursion">Delete</button>

                <!-- For new excursions: only show create button -->
                <button v-if="props.new" @click="createExcursion(editableExcursion)">Create</button>

                <button @click="$emit('close')">Close</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import TripCard from '../trips/TripCard.vue';
import { useUserStore } from '@/stores/user';

const props = defineProps({
    excursion: {
        type: Object,
        required: true
    },
    new: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['close', 'update', 'delete']);

const isEditing = ref(props.new);
const editableExcursion = ref({ ...props.excursion });

const userStore = useUserStore();
const token = userStore.token;


watch(
    () => props.excursion,
    (newVal) => {
        editableExcursion.value = { ...newVal };
    }
);

function enableEditing() {
    isEditing.value = true;
}

async function deleteExcursion() {
    const url = `https://excursions-api-server.azurewebsites.net/excursion/${props.excursion._id}`;
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    const response = await fetch(url, options);
    if (!response.ok) {
        console.error('Error deleting excursion:', response.statusText);
        return;
    }

    emit('delete');
}

async function createExcursion(newData) {
    const url = "https://excursions-api-server.azurewebsites.net/excursion";
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newData)
    });
    if (!response.ok) {
        console.error('Error creating excursion:', response.statusText);
        return;
    }


    const createdExcursion = await response.json();

    emit('update', createdExcursion);
}

async function saveChanges() {
    const url = `https://excursions-api-server.azurewebsites.net/excursion/${props.excursion._id}`;

    const data = {
        name: editableExcursion.value.name,
        description: editableExcursion.value.description,
        trips: editableExcursion.value.trips
    };

    const options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    };

    const response = await fetch(url, options);
    if (!response.ok) {
        console.error('Error updating excursion:', response.statusText);
        return;
    }

    emit('update', editableExcursion.value);
    isEditing.value = false;
}

function removeTrip(index) {
    editableExcursion.value.trips.splice(index, 1);
}
</script>

<style scoped>
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
}

.modal-actions {
    margin-top: 1.5rem;
    display: flex;
    gap: 1rem;
}

.trip-list {
    margin-top: 1rem;
}
</style>
