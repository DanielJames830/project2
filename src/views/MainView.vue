<template>
  <div class="view">
    <header>
      <RouterView name="header" :key="$route.path"></RouterView>
    </header>
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
import TitleBar from '@/components/TitleBar.vue';

</script>
