<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
            <h2 v-if="!isEditing">{{ trip.name }}</h2>
            <div v-else>
                <label for="name">Name</label>
                <input id="name" v-model="editableTrip.name" required />
            </div>

            <p v-if="!isEditing">{{ trip.description }}</p>
            <div v-else>
                <label for="description">Description</label>
                <textarea id="description" v-model="editableTrip.description" required></textarea>
            </div>

            <div>
                <label for="startDate">Start Date</label>
                <input id="startDate" type="datetime-local" v-model="editableTrip.startDate" required />
            </div>

            <div>
                <label for="endDate">End Date</label>
                <input id="endDate" type="datetime-local" v-model="editableTrip.endDate" required />
            </div>

            <div>
                <label for="park">Park</label>
                <input id="park" v-model="editableTrip.park" placeholder="Enter Park ID" />
            </div>

            <div>
                <label for="campground">Campground</label>
                <input id="campground" v-model="editableTrip.campground" placeholder="Enter Campground ID" />
            </div>

            <div>
                <label for="thingstodo">Things To Do</label>
                <textarea id="thingstodo" v-model="editableTrip.thingstodo"
                    placeholder="Comma-separated IDs"></textarea>
            </div>

            <div class="modal-actions">
                <button v-if="props.new" @click="createTrip(editableTrip)">Create</button>
                <button v-else-if="isEditing" @click="saveChanges">Save</button>
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
        editableTrip.value = {
            ...newVal,
            thingstodo: Array.isArray(newVal.thingstodo) ? newVal.thingstodo.join(', ') : ''
        };
    }
);

async function createTrip(newData) {
    newData.thingstodo = newData.thingstodo.split(',').map(id => id.trim());
    const url = "https://excursions-api-server.azurewebsites.net/trip";

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
        park: editableTrip.value.park,
        campground: editableTrip.value.campground,
        thingstodo: editableTrip.value.thingstodo.split(',').map(id => id.trim())
    };

    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        console.error('Error updating trip:', response.statusText);
        return;
    }

    emit('update', editableTrip.value);
    isEditing.value = false;
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
</style>
