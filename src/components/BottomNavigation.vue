<template>
  <nav class="bottom-nav">
    <RouterLink to="/excursions" class="nav-item" active-class="active">
      <span>🌍 Excursions</span>
    </RouterLink>
    <RouterLink to="/profile" class="nav-item" active-class="active">
      <span>👤 Profile</span>
    </RouterLink>
  </nav>
</template>

<script>
export default {
  name: "BottomNavigation",
};
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-around;
  background: #ffffff;
  padding: 10px 0;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
}
.nav-item {
  text-decoration: none;
  color: #666;
  font-size: 16px;
  padding: 10px;
}
.active {
  color: #007bff;
  font-weight: bold;
}
</style>
