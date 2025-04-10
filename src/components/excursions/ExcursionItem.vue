<template>
    <div class="excursion-item">
        <h2>{{ excursion.name }}</h2>
        <p>{{ excursion.description }}</p>
        <button @click="$emit('view-details', excursion)">View Details</button>
    </div>
</template>

<script setup>
defineProps({
    excursion: {
        type: Object,
        required: true
    }
});
</script>

<style scoped>
.excursion-item {
    border: 1px solid #ccc;
    padding: 1rem;
    border-radius: 10px;
    margin-bottom: 1rem;
}
</style>
