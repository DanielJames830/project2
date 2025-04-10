<template>
    <div class="trip-card">
        <p>{{ trip.name }}</p>
        <button v-if="isEditing" @click="$emit('remove')">Remove</button>
    </div>
</template>

<script setup>
const props = defineProps({
    trip: {
        type: Object,
        required: true
    },
    isEditing: {
        type: Boolean,
        default: false
    }
});
</script>

<style scoped>
.trip-card {
    border: 1px solid #ddd;
    padding: 0.5rem;
    border-radius: 5px;
    margin-bottom: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
