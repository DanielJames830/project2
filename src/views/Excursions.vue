<template>
  <div class="page">
    <TitleBar title="Excursions" subtitle="View and edit your profile" />
    <button class="floating-action-button">+</button>
    <div class="container">
      <h1>Excursions</h1>
      <p>Explore the world with us!</p>
      <div class="excursion-list">
        <div class="excursion-item" v-for="excursion in excursions" :key="excursion.id">
          <h2>{{ excursion.title }}</h2>
          <p>{{ excursion.description }}</p>
          <button @click="bookExcursion(excursion.id)">Book Now</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TitleBar from '@/components/TitleBar.vue';
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
  padding: 20px
}


</style>
