<template>
  <nav class="bottom-nav">
    <RouterLink to="/excursions" class="nav-item" active-class="active">
      <div class="nav-item">
        <font-awesome-icon :icon="['far', 'compass']" />
        <p>Excursions</p>
      </div>
    </RouterLink>
    <RouterLink to="/parks" class="nav-item" active-class="active">
      <div class="nav-item">
        <font-awesome-icon :icon="['fas', 'tree']" />
        <p>Parks</p>
      </div>
    </RouterLink>
    <RouterLink to="/trips" class="nav-item" active-class="active">
      <div class="nav-item">
        <font-awesome-icon :icon="['fas', 'map']" />
        <p>Trips</p>
      </div>
    </RouterLink>
    <!-- <RouterLink to="/friends" class="nav-item" active-class="active">
      <div class="nav-item">
        <font-awesome-icon :icon="['fas', 'users']" />
        <p>Friends</p>
      </div>
    </RouterLink> -->
    <RouterLink to="/profile" class="nav-item" active-class="active">
      <font-awesome-icon :icon="['fas', 'user']" />
      <p>Profile</p>
    </RouterLink>
  </nav>
</template>

<script setup>

</script>

<style scoped>
.bottom-nav {
  position: fixed;
  height: 80px;

  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-around;
  background: #ffffff;
  padding: 10px 0;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;

}

.nav-item {
  text-decoration: none;
  color: #21272A;
  font-size: 16px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-items: center;
  justify-content: center;
  justify-items: center;
  width: 50px;
  height: 50px;
  border-radius: 100%;
  transition: background-color 0.3s ease;
  transition: box-shadow 0.3s ease;

  p {
    margin-top: 8px;
    margin-bottom: 0px;
    font-size: 12px;
    color: #21272A;
  }

  svg {
    width: 24px;
    height: 24px;
  }
}

.active {
  background-color: #FFC15E;
  font-weight: bold;
  box-shadow: 0px 3px 0px rgba(0, 0, 0, 0.566);
}
</style>
