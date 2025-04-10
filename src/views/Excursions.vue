<template>
  <div class="page">
    <TitleBar title="Excursions" subtitle="View and edit your profile" />

    <button class="floating-action-button" @click="openModal">+</button>
    <div class="container">
      <h1>Excursions</h1>
      <p>Explore the world with us!</p>
      <div class="excursion-list">
        <div class="excursion-item" v-for="excursion in excursions" :key="excursion.id">
          <h2>{{ excursion.name }}</h2>
          <p>{{ excursion.description }}</p>
          <button @click="bookExcursion(excursion.id)">View Details</button>
        </div>
      </div>
    </div>

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
          <button type="submit">Submit</button>
          <button type="button" @click="closeModal">Cancel</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TitleBar from '@/components/TitleBar.vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const token = userStore.token;

const showModal = ref(false);

const newExcursion = ref({
  name: '',
  description: ''
});

function openModal() {
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

async function getExcursions() {
  const url = "https://excursions-api-server.azurewebsites.net/excursions";

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });



  if (!response.ok) {
    console.error('Error fetching excursions:', response.statusText);
    return;
  }

  const data = await response.json();

  return data;
}

const excursions = ref([]);
async function fetchExcursions() {
  const data = await getExcursions();
  if (data) {
    excursions.value = data['excursions'];
  }
}
onMounted(() => {
  fetchExcursions();
});

async function submitForm() {

  const url = "https://excursions-api-server.azurewebsites.net/excursion";

  const data = {
    name: newExcursion.value.name,
    description: newExcursion.value.description,
    trips: [],
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    console.error('Error creating excursion:', response.statusText);
    return;
  }


  closeModal();
}


</script>

<style scoped>
.container {
  background-color: white;
  padding: 2rem;
  border-radius: 30px;
}

.floating-action-button {
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
</style>
