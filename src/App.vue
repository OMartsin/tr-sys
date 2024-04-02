<script setup lang="ts">
import { RouterView } from 'vue-router'
import AdminHeader from './components/AdminHeader.vue';
import AdminSidebar from './components/AdminSidebar.vue';

</script>

<template>
  <div class="main-context-container">
    <AdminSidebar />
    <div class="app-container">
      <AdminHeader />
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ebecf1;
  border-radius: 0.5rem;
  width: 100%;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.main-context-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 1em;
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
