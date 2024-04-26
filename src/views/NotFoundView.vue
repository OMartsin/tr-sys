<script setup lang="ts">
import { useHeaderStore } from '../pinia/header';
import { onMounted } from 'vue';

onMounted(() => {
    useHeaderStore().setTitle('404');
});

</script>

<template>
    <div class="not-found">
        <h1>404</h1>
        <h2>Page not found</h2>
        <p>Sorry, the page you are looking for does not exist.</p>
        <router-link to="/" class="button">Go back to home</router-link>
    </div>
</template>

<style scoped>
.not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 34rem;
    padding: 1.25rem;
    padding-top: 0;
    margin: 1rem;
    gap: 1rem;
    font-size: 2rem;
    color: #333;
}
</style>