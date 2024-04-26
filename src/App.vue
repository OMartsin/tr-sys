<script setup lang="ts">
import { RouterView } from 'vue-router'
import AdminHeader from './components/AdminHeader.vue';
import AdminSidebar from './components/AdminSidebar.vue';
import { hasLoaded } from './router';
import { ref } from 'vue';

// export const hasLoadedOnPageLoad = ref(false);

</script>

<template>
  <div class="main-context-container" v-if="!hasLoaded">
    <AdminSidebar />
    <div class="app-container">
      <AdminHeader />
      <RouterView />
    </div>
  </div>
  <div class="loading-context-container" v-else>
    <v-progress-circular indeterminate color="white" model-value="20" :size="128" :width="12"></v-progress-circular>  
    <h2>Loading...</h2>
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

.loading-context-container{
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: #211e4f;
  color: white;
}
</style>
