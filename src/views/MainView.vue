<template>
  <div class="view">
    <header>
      <RouterView name="header" :key="$route.path"></RouterView>
    </header>
    <main class="main-content">
      <RouterView name="focus" :key="$route.path"></RouterView>
    </main>
    <footer>
      <BottomNavigation></BottomNavigation>
    </footer>
  </div>
</template>

<script setup>
import BottomNavigation from '@/components/BottomNavigation.vue';

</script>

<style scoped>
.main-content {
  flex: 1;
  /* Ensure it takes up remaining space */
  width: 100%;
  overflow-y: auto;
  /* Allow scrolling if content overflows */
  padding-top: 60px;
  /* Match TitleBar height */
  padding-bottom: 80px;
  /* Match BottomNavigation height */
}
</style>
