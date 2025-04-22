<template>
  <div class="container">
    <h1>Your Excursions</h1>
    <button class="floating-action-button" @click="openModal">+</button>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="excursions.length === 0" class="no-results">No excursions found.</div>
    <div v-else class="excursion-list">
      <ExcursionItem v-for="excursion in excursions" :key="excursion._id" :excursion="excursion"
        :formatDate="formatDate" @updated="loadExcursions" />
    </div>

    <!-- New Excursion Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h2>New Excursion</h2>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="name">Name</label>
            <input id="name" v-model="newExcursion.name" required />
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" v-model="newExcursion.description" required></textarea>
          </div>
          <div class="form-group">
            <label for="trips">Trips</label>
            <Multiselect id="trips" v-model="newExcursion.trips" :options="tripOptions" :multiple="true"
              :close-on-select="false" :clear-on-select="false" :preserve-search="true" placeholder="Select trips"
              label="name" track-by="_id" />
          </div>
          <div class="modal-actions">
            <button type="submit">Submit</button>
            <button type="button" @click="closeModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchExcursions, createExcursion } from '@/services/excursions';
import { fetchTrips } from '@/services/trips';
import Multiselect from 'vue-multiselect';
import ExcursionItem from '@/components/excursions/ExcursionItem.vue';

const excursions = ref([]);
const loading = ref(true);
const showModal = ref(false);
const newExcursion = ref({ name: '', description: '', trips: [] });
const tripOptions = ref([]);

function formatDate(dateStr) {
  return dateStr ? new Date(dateStr).toLocaleString() : '';
}

async function loadExcursions() {
  loading.value = true;
  try {
    const data = await fetchExcursions();
    excursions.value = data.excursions || data;
  } catch {
    excursions.value = [];
  }
  loading.value = false;
}

async function openModal() {
  newExcursion.value = { name: '', description: '', trips: [] };
  showModal.value = true;
  try {
    const tripsData = await fetchTrips();
    tripOptions.value = Array.isArray(tripsData.trips) ? tripsData.trips : [];
  } catch {
    tripOptions.value = [];
  }
}

function closeModal() {
  showModal.value = false;
}

async function submitForm() {
  try {
    await createExcursion(newExcursion.value);
    closeModal();
    await loadExcursions();
  } catch (e) {
    console.error('Error creating excursion:', e.message);
  }
}

onMounted(loadExcursions);
</script>


<style scoped>
.container {
  background-color: white;
  padding: 2rem;
  border-radius: 30px;
}

.floating-action-button {
  color: #21272a;
  font-size: xx-large;
  border-radius: 100%;
  width: 60px;
  height: 60px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #FFC15E;
  font-weight: bold;
  position: fixed;
  right: 20px;
  bottom: 120px;
  box-shadow: 0px 3px 0px rgba(0, 0, 0, 0.566);
  z-index: 1000;
  padding: 20px;
}

.excursion-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.trip-list {
  height: 300px;
  overflow-y: auto;
}

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

.loading,
.no-results {
  margin: 2rem 0;
  color: #888;
  text-align: center;
}

/* Modal styles */
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
