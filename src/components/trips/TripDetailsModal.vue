<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <form class="trip-form" @submit.prevent="props.new ? createTrip(editableTrip) : saveChanges()">
            <div class="modal-content" ref="modalContent" @touchstart="onTouchStart" @touchmove="onTouchMove"
                @touchend="onTouchEnd">
                <h2 class="modal-title">
                    {{ isEditing ? (props.new ? `Create ${editableTrip.park?.name || ''} Trip` : `Edit
                    ${editableTrip.park?.name || ''} Trip`) : trip.name }}
                </h2>

                <!-- Page 1 -->
                <div v-show="page === 0">
                    <div class="form-group">
                        <label for="name"><strong>Name</strong></label>
                        <input id="name" v-model="editableTrip.name" type="text" placeholder="Trip Name" required
                            :readonly="!isEditing" />
                    </div>
                    <div class="form-group">
                        <label for="description"><strong>Description</strong></label>
                        <textarea id="description" v-model="editableTrip.description" placeholder="Description" required
                            :readonly="!isEditing"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="startDate"><strong>Start Date</strong></label>
                        <input id="startDate" type="datetime-local" v-model="editableTrip.startDate"
                            :readonly="!isEditing" />
                    </div>
                    <div class="form-group">
                        <label for="endDate"><strong>End Date</strong></label>
                        <input id="endDate" type="datetime-local" v-model="editableTrip.endDate"
                            :readonly="!isEditing" />
                    </div>
                </div>

                <!-- Page 2 -->
                <div v-show="page === 1">
                    <div class="form-group">
                        <label for="campground"><strong>Campground</strong></label>
                        <multiselect id="campground" v-model="editableTrip.campground" :options="campgroundOptions"
                            :multiple="false" :close-on-select="true" :clear-on-select="true" :preserve-search="true"
                            placeholder="Select a campground" label="name" track-by="id" :disabled="!isEditing" />
                    </div>
                </div>

                <!-- Page 3 -->
                <div v-show="page === 2">
                    <div class="form-group">
                        <label for="thingstodo"><strong>Things To Do</strong></label>
                        <multiselect id="thingstodo" v-model="editableTrip.thingstodo" :options="thingsToDoOptions"
                            :multiple="true" :close-on-select="false" :clear-on-select="false" :preserve-search="true"
                            placeholder="Select things to do" label="title" track-by="id" :disabled="!isEditing" />
                    </div>
                    <div class="form-group">
                        <label for="notes"><strong>Notes</strong></label>
                        <textarea id="notes" v-model="editableTrip.notes" placeholder="Any notes..."
                            :readonly="!isEditing"></textarea>
                    </div>
                </div>

                <div class="page-indicator">
                    <span v-for="i in 3" :key="i" :class="{ active: page === i - 1 }"></span>
                </div>

                <div class="modal-actions">
                    <button type="button" @click="prevPage" :disabled="page === 0">Prev</button>
                    <button type="button" @click="nextPage" v-if="page < 2">Next</button>
                    <button v-if="props.new && page === 2" type="submit">Create</button>
                    <button v-else-if="isEditing && page === 2" type="submit">Save</button>
                    <button type="button" @click="$emit('close')">Close</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { createTrip } from '@/services/trips';
import Multiselect from 'vue-multiselect';
import { fetchCampgrounds, fetchThingsToDo } from '@/services/nationalParks';

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
const page = ref(0);

const userStore = useUserStore();
const token = userStore.token;

// Campground multiselect
const campgroundOptions = ref([]);

// Things to do multiselect
const thingsToDoOptions = ref([]);

// Swipe gesture logic
const touchStartX = ref(null);
const touchEndX = ref(null);

function onTouchStart(e) {
    touchStartX.value = e.changedTouches[0].screenX;
}
function onTouchMove(e) {
    touchEndX.value = e.changedTouches[0].screenX;
}
function onTouchEnd() {
    if (touchStartX.value !== null && touchEndX.value !== null) {
        const dx = touchEndX.value - touchStartX.value;
        if (dx > 50) prevPage();
        else if (dx < -50) nextPage();
    }
    touchStartX.value = null;
    touchEndX.value = null;
}

async function nextPage() {
    if (page.value < 2) page.value++;

    try {
        const data = await fetchCampgrounds(editableTrip.value.park.parkCode);
        campgroundOptions.value = Array.isArray(data.data) ? data.data : data;
    } catch (e) {
        campgroundOptions.value = [];
    }

    // Fetch things to do when entering page 2
    if (page.value === 2 && editableTrip.value.park?.parkCode) {
        try {
            const thingsData = await fetchThingsToDo(editableTrip.value.park.parkCode);
            // Support both {data:[]} and [] API responses
            thingsToDoOptions.value = Array.isArray(thingsData.data) ? thingsData.data : thingsData;
        } catch (e) {
            thingsToDoOptions.value = [];
        }
    }

    if (editableTrip.value.campground && typeof editableTrip.value.campground === 'string') {
        const found = campgroundOptions.value.find(cg => cg.id === editableTrip.value.campground);
        if (found) editableTrip.value.campground = found;
    }
}
function prevPage() {
    if (page.value > 0) page.value--;
}

watch(
    () => props.trip,
    (newVal) => {
        editableTrip.value = {
            ...newVal,
            // Convert thingstodo array of IDs to array of objects for multiselect
            thingstodo: Array.isArray(newVal.thingstodo)
                ? newVal.thingstodo.map(id =>
                    thingsToDoOptions.value.find(t => t.id === id) || { id, title: id }
                )
                : []
        };
        // If campground is an id, convert to object for multiselect
        if (editableTrip.value.campground && typeof editableTrip.value.campground === 'string') {
            const found = campgroundOptions.value.find(cg => cg.id === editableTrip.value.campground);
            if (found) editableTrip.value.campground = found;
        }
    }
);

async function saveChanges() {
    const url = `https://excursions-api-server.azurewebsites.net/trip/${props.trip._id}`;

    const data = {
        name: editableTrip.value.name,
        description: editableTrip.value.description,
        startDate: editableTrip.value.startDate,
        endDate: editableTrip.value.endDate,
        park: editableTrip.value.park,
        campground: editableTrip.value.campground?.id || editableTrip.value.campground,
        // Convert selected things to do objects to array of IDs
        thingstodo: Array.isArray(editableTrip.value.thingstodo)
            ? editableTrip.value.thingstodo.map(t => t.id)
            : []
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
    margin: 20px;
}

.trip-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 1rem;
    width: 100%;
}

.form-group label {
    margin-bottom: 0.3rem;
    font-size: 1rem;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 10px;
    font-size: 1.1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    box-sizing: border-box;
    background: #f8f8f8;
}

.form-group input[readonly],
.form-group textarea[readonly] {
    background: #e9ecef;
    color: #888;
}

.modal-title {
    margin-bottom: 1rem;
    font-size: 1.3rem;
    font-weight: bold;
    text-align: center;
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

.page-indicator {
    display: flex;
    justify-content: center;
    margin: 1rem 0 0.5rem 0;
    gap: 0.5rem;
}

.page-indicator span {
    display: inline-block;
    width: 10px;
    height: 10px;
    background: #ccc;
    border-radius: 50%;
    transition: background 0.2s;
}

.page-indicator span.active {
    background: #21272a;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
