<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const userProfile = ref({
  name: 'Admin User',
  // Add more profile-related properties here
});

const logout = () => {
  // Implement your logout logic here
};

const router = useRouter();
</script>

<template>
  <header class="app-header">
    <h1>{{router.currentRoute.value.name}}</h1>
    <nav class="user-profile">
      <img src="/src/assets/avatar.svg" class="user-avatar" alt="User Avatar" />
      <div class="user-info-block">
        <span class="user-name">{{ userProfile.name }}</span>
        <span> Admin </span>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.app-header {
  width: 100%;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #211e4f;
}

.user-profile {
  display: flex;
  gap: 1rem;
  padding-right: 2rem;
  align-items: center;
}

.user-avatar {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
}

.user-info-block{
  display: flex;
  flex-direction: column;
}


.user-name{
  font-weight: bold;
}

nav a {
  color: #333;
  padding: 0.5rem 1rem;
  text-decoration: none;
  transition: color 0.3s ease;
}

nav a.router-link-exact-active,
nav a:hover {
  color: #0056b3;
  background-color: transparent;
}

nav a:first-of-type {
  border-left: none;
}

</style>