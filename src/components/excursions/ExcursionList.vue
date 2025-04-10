<template>
    <div class="page">
        <TitleBar title="Excursions" subtitle="View and edit your profile" />
        <button class="floating-action-button" @click="openNewExcursionModal">+</button>
        <div class="container">
            <h1>Excursions</h1>
            <p>Explore the world with us!</p>
            <div class="excursion-list">
                <ExcursionItem v-for="excursion in excursions" :key="excursion.id" :excursion="excursion"
                    @view-details="openExcursionDetails" />
            </div>
        </div>
        <ExcursionDetailsModal v-if="selectedExcursion" :excursion="selectedExcursion" @close="selectedExcursion = null"
            @update="updateExcursion" @delete="deleteExcursion" />

        <ExcursionDetailsModal v-if="showNewExcursionModal" :excursion="newExcursion" new
            @close="closeNewExcursionModal" @update="createdExcursion" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TitleBar from '@/components/TitleBar.vue';
import { useUserStore } from '@/stores/user';
import ExcursionItem from './ExcursionItem.vue';
import ExcursionDetailsModal from './ExcursionDetailsModal.vue';

const userStore = useUserStore();
const token = userStore.token;

const excursions = ref([]);
const selectedExcursion = ref(null);
const showNewExcursionModal = ref(false);
const newExcursion = ref({
    name: '',
    description: '',
    trips: []
});

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

async function fetchExcursions() {
    const data = await getExcursions();
    if (data) {
        excursions.value = data['excursions'];
    }
}

onMounted(() => {
    fetchExcursions();
});

function createdExcursion() {
    closeNewExcursionModal();
    fetchExcursions();
}

async function deleteExcursion() {
    selectedExcursion.value = null
    await fetchExcursions();
}

function openExcursionDetails(excursion) {
    selectedExcursion.value = { ...excursion };
}

function updateExcursion(updatedExcursion) {
    const index = excursions.value.findIndex(e => e.id === updatedExcursion.id);
    if (index !== -1) {
        excursions.value[index] = updatedExcursion;
    }
    selectedExcursion.value = null;
}

function openNewExcursionModal() {
    newExcursion.value = {
        name: '',
        description: '',
        trips: []
    };
    showNewExcursionModal.value = true;
}

function closeNewExcursionModal() {
    showNewExcursionModal.value = false;
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
</style>
