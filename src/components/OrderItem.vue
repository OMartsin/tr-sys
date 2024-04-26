<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { Order, OrderForDetails } from '../types';
import { useRouter } from 'vue-router';


const { order } = defineProps<{
  order: Order;
}>();

const router = useRouter();

const emit = defineEmits(['edit', 'delete', 'details']);

const editOrder = (order: Order) => {
  emit('edit', order);
};

const deleteOrder = (id: number) => {
  emit('delete', id);
};

const goToDetails = (id: number) => {
  router.push(`/order/${id}`);
};
</script>

<template>
  <div class="client-item">
    <div class="client-info">
      <img src="/src/assets/avatar.svg" class="user-avatar" alt="User Avatar" />
      <div class="client-details">
        <h3 @click="goToDetails(order.id)">{{ order.name }}</h3>
        <p>Price: {{ order.price }}</p>
        <p>Departure date: {{ order.departureDate.toLocaleDateString() }}</p>
      </div>
    </div>
    <div class="client-actions">
      <font-awesome-icon :icon="['far', 'pen-to-square']" class="action-button" @click="editOrder(order)" />
      <font-awesome-icon :icon="['fas', 'trash']" class="action-button" @click="deleteOrder(order.id)" />
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