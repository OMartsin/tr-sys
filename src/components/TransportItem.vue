<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { Transport } from '../types';
import router from '../router';


const { transport, isTrailer, editTransportProp, deleteTransportProp } = defineProps<{
  transport: Transport;
  isTrailer: boolean;
  editTransportProp: (id: number) => void;
  deleteTransportProp: (id: number) => void;
}>();


const editTransport = (id: number) => {
  editTransportProp(id);
};

const deleteTransport = (id: number) => {
  deleteTransportProp(id);
};

const goToDetails = (id: number) => {
  isTrailer ? router.push(`/trailer/${id}`) : router.push(`/truck/${id}`);
};
</script>

<template>
  <div class="client-item">
    <div class="client-info">
      <img src="/src/assets/avatar.svg" class="user-avatar" alt="User Avatar" />
      <div class="client-details">
        <h3 @click="goToDetails(transport.id)">{{ transport.brand + " " + transport.model }}</h3>
        <p>Registation number: {{ transport.registrationNumber }}</p>
        <p>weight: {{ transport.weight }}</p>
      </div>
    </div>
    <div class="client-actions">
      <font-awesome-icon :icon="['far', 'pen-to-square']" class="action-button" @click="editTransport(transport.id)" />
      <font-awesome-icon :icon="['fas', 'trash']" class="action-button" @click="deleteTransport(transport.id)" />
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
  color: #6c757d;
}

.client-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.client-info h3 {
  cursor: pointer;
  color: #515FF1;
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