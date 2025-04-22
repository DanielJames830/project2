<template>
    <div class="excursion-item" @click="openModal">

          <h2>{{ excursion.name }}</h2>
          <p>{{ excursion.description }}</p>



    </div>

    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
           <div v-if="!editing">
            <h2>{{ excursion.name }}</h2>
            <p>{{ excursion.description }}</p>
           </div>

            <div v-if="editing">
          <h2>Edit Excursion</h2>
          <form @submit.prevent="saveChanges">
            <div class="form-group">
                    <label for="name">Name</label>
                    <input id="name" v-model="editableTrip.name" type="text"/>
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" v-model="editableTrip.description"></textarea>
                </div>
          </form>
        </div>

            <div class="trip-list">
                <TripItem v-for="trip in excursion.trips" :key="trip._id" :trip="trip" :formatDate="formatDate"
                    @deleted="onTripDeleted" />
            </div>

            <div class="modal-actions">
                <button @click="handleDelete">Delete</button>
                <button v-if="!editing" @click="startEditing">Edit</button>
                <button v-if="editing" @click="endEditing">Save</button>
                <button @click="closeModal">Close</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import TripItem from '@/components/trips/TripItem.vue';
import { deleteExcursionById, handleExcursionInvite, updateExcursionById } from '@/services/excursions';

const editing = ref(false);

const props = defineProps({
    excursion: { type: Object, required: true },
    formatDate: { type: Function, required: true }
});
const emit = defineEmits(['updated']);

const editableTrip = ref({ ...props.excursion})

const isModalOpen = ref(false);

function startEditing() {
editing.value = true;
}

async function endEditing() {
  await updateExcursionById(props.excursion._id, editableTrip.value)
  emit('updated');

  emit('close');
}

function openModal() {
    isModalOpen.value = true;
}

function closeModal() {
    isModalOpen.value = false;
}

function onTripDeleted(trip) {
    emit('deleted');
}

async function handleDelete() {
    try {
        await deleteExcursionById(props.excursion._id);
        closeModal();
        emit('deleted', props.excursion);
    } catch {
        alert('Failed to delete excursion.');
    }
}
</script>

<style scoped>
.excursion-item {
    border: 1px solid #ccc;
    width: 300px;
    border-radius: 10px;
    padding: 1rem;
    cursor: pointer;
    background: #f8f8f8;
    transition: background 0.2s;
}

.excursion-item:hover {
    background: #ffe6b0;
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
}

.trip-list {
    height: 300px;
    overflow-y: auto;
    margin: 1rem 0;
}

.modal-actions {
    margin-top: 1.5rem;
    display: flex;
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
