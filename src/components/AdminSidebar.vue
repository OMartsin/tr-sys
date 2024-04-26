<script setup lang="ts">
import { ref } from 'vue';

const menuItems = ref([
  { text: 'Dashboard', route: '/', icon: 'tachometer-alt'},
  { text: 'Clients', route: '/clients', icon: 'user' },
  { text: 'Drivers', route: '/drivers', icon: 'fa-truck' },
  { text: 'Trucks', route: '/trucks', icon: 'truck' },
  { text: 'Trailers', route: '/trailers', icon: 'truck-loading' },
  { text: 'Orders', route: '/orders', icon: 'shopping-cart' },
  { text: 'Reports', route: '/reports', icon: 'chart-bar' },
]);
</script>

<template>
  <aside class="app-sidebar">
    <h2>Truck trailer</h2>
    <ul>
      <li v-for="item in menuItems" :key="item.text" class="link-row-container">
        <router-link :to="item.route"><font-awesome-icon :icon="['fas', item.icon ]" class="icon"/> {{ item.text }}</router-link>
      </li>
    </ul>
  </aside>
</template>


<style scoped>
.app-sidebar {
  color: #cdc9dd;
  padding: 1rem;
  font-size: 1.1rem;
  width: 13rem;
  font-weight: bold;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.icon {
  width: 1.5rem;
}

.link-row-container{
  display: flex;
  align-items: center;
  gap: 1rem;
}

.app-sidebar ul {
  list-style-type: none;
  padding: 0;
}

.app-sidebar li {
  margin-bottom: 0.5rem;
}

.app-sidebar li a {
  text-decoration: none;
  color: #cdc9dd;
  font-weight: bold;
}
</style>