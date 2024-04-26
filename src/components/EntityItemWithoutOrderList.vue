<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { EntityForDetails } from '../types';
import { defineProps } from 'vue';

const { entity } = defineProps<{
    entity: EntityForDetails;
}>();

const fieldsArray = ref<Array<[string, string]>>([]);

onMounted(() => {
  console.log(entity);
  fieldsArray.value = Array.from(entity.fields);
})

</script>

<template>
  <div class="entity-details">
    <div class="fields">
      <div v-for="[key, value] in fieldsArray" :key="key" class="field">
        <div class="field-key">{{ key + ":"}}</div>
        <div class="field-value">{{ value }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.entity-details {
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

@media (min-width: 768px) {
  .fields {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* Create two columns */
  }
}
.field {
  display: flex; 
  flex-direction: column;
  justify-items: center; 
  border-radius: 8px;
  margin: 10px;
  border-bottom: 2px solid #ccc; 
}
.field-key {
  color: #6c757d;
  font-weight: bold;
  margin-right: 5px; 
}
.field-value {
  flex-grow: 1; 
  color: #495057;
}
.orders {

}
</style>


