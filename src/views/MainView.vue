<template>
  <div class="view">
    <main>
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
