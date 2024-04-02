<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { Client } from '../types';


const props = defineProps<{
  client: Client;
}>();

const emit = defineEmits(['edit', 'delete', 'details']);

const editClient = (id: number) => {
  // Emit edit event with id
  emit('edit', id);
};

const deleteClient = (id: number) => {
  // Emit delete event with id
  emit('delete', id);
};

const goToDetails = (id: number) => {
  // Emit details event with id
  emit('details', id);
};
</script>

<template>
  <div class="client-item">
    <div class="client-info">
      <img src="/src/assets/avatar.svg" class="user-avatar" alt="User Avatar" />
      <div class="client-details">
        <h3 @click="goToDetails(client.id)">{{ client.name }}</h3>
        <p>EDRPOU: {{ client.edrpou }}</p>
        <p>Account Number: {{ client.iban }}</p>
      </div>
    </div>
    <div class="client-actions">
      <font-awesome-icon :icon="['far', 'pen-to-square']" class="action-button" @click="editClient(client.id)" />
      <font-awesome-icon :icon="['fas', 'trash']" class="action-button" @click="deleteClient(client.id)" />
    </div>
  </div>
</template>

<style scoped>
.client-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid #ccc;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.1);
}

.client-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.client-info h3 {
  cursor: pointer;
  color: blue;
}

.user-avatar {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
}

.client-details{
  display: flex;
  flex-direction: column;
}

.client-actions {
  margin-right: 1.5rem;
  display: flex;
  gap: 1rem;
}

.action-button {
  border: none;
  color: #6e6b96;
  font-size: 1.5rem;
  font-weight: 500;
  cursor: pointer;
}
</style>