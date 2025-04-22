<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content" v-if="isEditing">
            <h2>Edit Trip</h2>
            <form @submit.prevent="saveChanges">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input id="name" v-model="editableTrip.name" type="text" required />
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" v-model="editableTrip.description" required></textarea>
                </div>
                <div class="form-group">
                    <label for="startDate">Start Date</label>
                    <input id="startDate" v-model="editableTrip.startDate" type="datetime-local" required />
                </div>
                <div class="form-group">
                    <label for="endDate">End Date</label>
                    <input id="endDate" v-model="editableTrip.endDate" type="datetime-local" required />
                </div>
                <div class="modal-actions">
                    <button type="submit">Save</button>
                    <button type="button" @click="isEditing = false">Cancel</button>
                </div>
            </form>
        </div>
        <div class="modal-content" v-else>
            <h2>{{ trip.name }}</h2>
            <p><strong>Description:</strong> {{ trip.description }}</p>
            <p><strong>Start:</strong> {{ formatDate(trip.startDate) }}</p>
            <p><strong>End:</strong> {{ formatDate(trip.endDate) }}</p>
            <p><strong>Park:</strong> {{ park?.name || park }}</p>
            <p v-if="campground"><strong>Campground:</strong> {{ campground?.name || campground }}</p>
            <div v-if="thingsToDo && thingsToDo.length">
                <strong>Things To Do:</strong>
                <ul>
                    <li v-for="item in thingsToDo" :key="item.id">{{ item.title || item.name || item.id }}</li>
                </ul>
            </div>
            <div class="modal-actions">
                <button @click="onDelete">Delete</button>
                <button @click="isEditing = true">Edit</button>
                <button @click="$emit('close')">Close</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { deleteTripById, updateTripById } from '@/services/trips';

const props = defineProps({
    trip: { type: Object, required: true },
    park: { type: [Object, String], default: null },
    campground: { type: [Object, String], default: null },
    thingsToDo: { type: Array, default: () => [] }
});

const emit = defineEmits(['close', 'delete', 'edit', 'update']);
const isEditing = ref(false);
const editableTrip = ref({ ...props.trip });

function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleString();
}

async function onDelete() {
    if (!props.trip || !props.trip._id) return;
    await deleteTripById(props.trip._id);
    emit('delete', props.trip);
}

async function saveChanges() {
    await updateTripById(props.trip._id, editableTrip.value)
    emit('update', editableTrip.value);
    isEditing.value = false;
    emit('close');
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
    margin: 20px;
    min-width: 300px;
    max-width: 500px;
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
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
}

.modal-actions {
    margin-top: 1.5rem;
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}

.modal-actions button {
    background-color: #21272a;
    color: white;
    padding: 10px 18px;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
}

.modal-actions button:hover {
    background-color: #FFC15E;
    color: #21272a;
}
</style>
