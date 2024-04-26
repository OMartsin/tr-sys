<script setup lang="ts">
import { ref } from 'vue';
import type { Transport } from "../types"

const { close } = defineProps<{
  close: () => void
}>();

const editTransport = ref<Transport>({} as Transport);

const handleSubmit = (e: Event) => {
  console.log(editTransport.value);
}
</script>

<template>
  <div class="edit-transport-overlay">
    <div class="overlay-content">
      <h2>Edit Truck</h2>
      <form @submit.prevent="handleSubmit" class="edit-form">
        <div class="edit-field">
          <label for="brand">Truck brand:</label>
          <input type="text" id="brand" class="input-row-type-text" v-model="editTransport.brand" />
        </div>
        <div class="edit-field">
          <label for="model">Truck Model:</label>
          <input type="text" id="model" class="input-row-type-text" v-model="editTransport.model" />
        </div>
        <div class="edit-field">
          <label for="registrationNumber">Registration Number:</label>
          <input type="text" id="registrationNumber" class="input-row-type-text" v-model="editTransport.registrationNumber" />
        </div>
        <div class="edit-field">
          <label for="weight">Weight:</label>
          <input type="number" id="weight" class="input-row-type-text number-text" v-model.number="editTransport.weight" />
        </div>
        <div class="buttons">
          <button type="button" class="cancel-button button" @click="close">Cancel</button>
          <button type="submit" class="submit-button button">Save Changes</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.edit-transport-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 25rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.edit-form {
  display: flex;
  flex-direction: column;
}

.edit-field {
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0.5rem;
  gap: 0.25rem;
}

.input-row-type-text{
  padding: 0.875rem 1rem;
  display: inline-block;
  border: none;
  border-bottom: 2px solid grey;
  border-radius: 4px;
  box-sizing: border-box;
}

.number-text::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.number-text {
  -moz-appearance: textfield;
}

.buttons{
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 0rem 0rem 0rem;
}

.button{
  border: none;
  padding: 0.75rem 1rem;
  font-size: 0.9375rem;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button{
  background-color: #2563eb;
  color: white;
}

.cancel-button{
  background-color: #f3f4f6;
}
</style>