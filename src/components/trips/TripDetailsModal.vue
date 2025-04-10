<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
            <h2 v-if="!isEditing">{{ trip.name }}</h2>
            <div v-else>
                <label for="name">Name</label>
                <input id="name" v-model="editableTrip.name" />
            </div>

            <p v-if="!isEditing">{{ trip.description }}</p>
            <div v-else>
                <label for="description">Description</label>
                <textarea id="description" v-model="editableTrip.description"></textarea>
            </div>

            <div class="date-list" v-if="isEditing">
                <label for="startDate">Start Date</label>
                <input id="startDate" type="date" v-model="editableTrip.startDate"
                    @change="updateDate('startDate', editableTrip.startDate)" />

                <label for="endDate">End Date</label>
                <input id="endDate" type="date" v-model="editableTrip.endDate"
                    @change="updateDate('endDate', editableTrip.endDate)" />
            </div>

            <div class="modal-actions">
                <button v-if="!props.new && !isEditing" @click="enableEditing">Edit</button>
                <button v-if="!props.new && isEditing" @click="saveChanges">Save</button>
                <button v-if="!props.new" @click="deleteTrip">Delete</button>
                <button v-if="props.new" @click="createTrip(editableTrip)">Create</button>
                <button @click="$emit('close')">Close</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useUserStore } from '@/stores/user';

const props = defineProps({
    trip: {
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
const editableTrip = ref({ ...props.trip });

const userStore = useUserStore();
const token = userStore.token;

watch(
    () => props.trip,
    (newVal) => {
        editableTrip.value = { ...newVal };
    }
);

function enableEditing() {
    isEditing.value = true;
}

async function deleteTrip() {
    const url = `https://excursions-api-server.azurewebsites.net/trip/${props.trip._id}`;
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    const response = await fetch(url, options);
    if (!response.ok) {
        console.error('Error deleting trip:', response.statusText);
        return;
    }

    emit('delete');
}

async function createTrip(newData) {
    const url = "https://excursions-api-server.azurewebsites.net/trip";

    console.log('Creating trip with data:', JSON.stringify(newData));

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newData)
    });
    if (!response.ok) {
        console.error('Error creating trip:', response.statusText);
        return;
    }

    const createdTrip = await response.json();
    emit('update', createdTrip);
}

async function saveChanges() {
    const url = `https://excursions-api-server.azurewebsites.net/trip/${props.trip._id}`;

    const data = {
        name: editableTrip.value.name,
        description: editableTrip.value.description,
        startDate: editableTrip.value.startDate,
        endDate: editableTrip.value.endDate,
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
        console.error('Error updating trip:', response.statusText);
        return;
    }

    emit('update', editableTrip.value);
    isEditing.value = false;
}

function updateDate(field, value) {
    editableTrip.value[field] = value;
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

.date-list {
    margin-top: 1rem;
}
</style>
