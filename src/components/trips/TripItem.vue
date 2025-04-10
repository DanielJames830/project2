<template>
    <div class="trip-item">
        <h2>{{ trip.name }}</h2>
        <p>{{ trip.description }}</p>
        <button @click="$emit('view-details', trip)">View Details</button>
    </div>
</template>

<script setup>
defineProps({
    trip: {
        type: Object,
        required: true
    }
});
</script>

<style scoped>
.trip-item {
    border: 1px solid #ccc;
    padding: 1rem;
    border-radius: 10px;
    margin-bottom: 1rem;
}
</style>
