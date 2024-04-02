<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ClientItem from '../components/ClientItem.vue';
import type { Client } from '../types';
import { serverUrl } from '../const';
import { toast } from 'vue3-toastify'


const clients = ref<Client[]>([] as Client[]);

onMounted(() => {
  // handle errors with toast
  fetch(`${serverUrl}/client`)
    .then((res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch clients');
      }
      return res.json();
    })
    .then((data) => {
      clients.value = data;
    })
    .catch((error) => {
      toast.error('Failed to fetch clients', {
        position: toast.POSITION.BOTTOM_RIGHT
      })
      console.error(error);
    });

})

const handleEdit = (id: number) => {

};

const handleDelete = (id: number) => {
  fetch(`${serverUrl}/client/${id}`, {
    method: 'DELETE',
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Failed to delete client');
      }
      clients.value = clients.value.filter((client) => client.id !== id);
      toast.success('Client deleted successfully', {
        position: toast.POSITION.BOTTOM_RIGHT
      })
    })
    .catch((error) => {
      toast.error('Failed to delete client', {
        position: toast.POSITION.BOTTOM_RIGHT
      })
      console.error(error);
    });
};

const handleDetails = (id: number) => {
  // Logic for handling client details view
};
</script>

<template>
  <div class="clients-list">
    <client-item v-for="client in clients" :key="client.id" :client="client" @edit="handleEdit" @delete="handleDelete"
      @details="handleDetails" />
  </div>
</template>

<style scoped>
.clients-list {
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  width: 100%;
  height: 34rem;
  gap: 10px;
  padding: 1.25rem;
  padding-top: 0;
  margin: 1rem;
}
</style>