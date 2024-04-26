<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useHeaderStore } from '../pinia/header';
import { useRoute, useRouter } from 'vue-router';
import { serverUrl } from '../const';
import { toast } from 'vue3-toastify';

const userProfile = ref({
  login: '', 
  token: ''
});

const logout = () => {
  // Implement your logout logic here
};
 
const login = () => {
  fetch(`${serverUrl}/login/admin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      login: 'admin',
      password: "admin"
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Failed to login');
      }
      return res.json();
    })
    .then((data) => {
      userProfile.value = data;
      localStorage.setItem("token", data.token);
    })
    .catch((error) => {
      console.error(error);
      toast.error(error, {
        position: toast.POSITION.BOTTOM_RIGHT
      })
    });
};

onMounted(() => {
  const token = localStorage.getItem("token");
  if (token) {
    fetch(`${serverUrl}/login/get-credentials`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to login');
        }
        return res.json();
      })
      .then((data) => {
        
        userProfile.value = data;

      })
      .catch((error) => {
        console.error(error);
        toast.error(error, {
          position: toast.POSITION.BOTTOM_RIGHT
        })
      });
  }
});

const route = useRoute();
const router = useRouter();

const isBaseRoute = computed(() => {
  return route.path === '/' || !route.path.substring(1).includes('/');
});

const goBack = () => {
  router.go(-1);
};

</script>

<template>
  <header class="app-header">
    <div class="navigation">
      <button v-if="!isBaseRoute" @click="goBack" class="back-button">
        <font-awesome-icon :icon="['fas', 'chevron-left']" />
      </button>
      <h1>{{ useHeaderStore().title }}</h1>
    </div>
    <nav class="user-profile" v-if="userProfile != undefined && userProfile.login.length > 0">
      <img src="/src/assets/avatar.svg" class="user-avatar" alt="User Avatar"/>
      <div class="user-info-block">
        <span class="user-name">{{ userProfile.login }}</span>
        <span> Admin </span>
      </div>
    </nav>
    <button v-else @click="login" class="back-button"> <font-awesome-icon :icon="['fas', 'chevron-left']" /></button>
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

.navigation {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.back-button {
  border: none;
  border-radius: 0.5rem;
  background: rgba(70, 62, 122, 0.1);
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  font-size: 1.5rem;
  color: rgba(31, 24, 92, 1);
  
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