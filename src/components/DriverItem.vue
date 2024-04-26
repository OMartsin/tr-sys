<script setup lang="ts">
import { defineProps } from 'vue';
import type { Driver } from '../types';
import router from '../router';


const { driver, edit, deleteDriverProp } = defineProps<{
  driver: Driver;
  edit: (driver: Driver) => void;
  deleteDriverProp: (id: number) => void;
}>();

const editDriver = (driver: Driver) => {
  edit(driver);
};

const deleteDriver = (id: number) => {
  deleteDriverProp(id);
};

const goToDetails = (id: number) => {
  router.push(`/driver/${id}`);
};
</script>

<template>
  <div class="client-item">
    <div class="client-info">
      <img src="/src/assets/avatar.svg" class="user-avatar" alt="User Avatar" />
      <div class="client-details">
        <h3 @click="goToDetails(driver.id)">{{ driver.name + " " + driver.surname }}</h3>
        <p>Nationality: {{ driver.nationality }}</p>
        <p>Passport number: {{ driver.passportNumber }}</p>
      </div>
    </div>
    <div class="client-actions">
      <font-awesome-icon :icon="['far', 'pen-to-square']" class="action-button" @click="editDriver(driver)" />
      <font-awesome-icon :icon="['fas', 'trash']" class="action-button" @click="deleteDriver(driver.id)" />
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