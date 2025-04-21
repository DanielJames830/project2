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

  width: 100%;
  overflow-y: auto;
  max-height: calc(100vh - 80px);
  padding-top: 30px;

  padding-bottom: 80px;

}
</style>
