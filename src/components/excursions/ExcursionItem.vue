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

<style scoped></style>
