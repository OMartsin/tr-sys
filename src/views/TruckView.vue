<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import TransportItem from '../components/TransportItem.vue';
import { Truck } from '../types';
import { serverUrl } from '../const';
import { toast } from 'vue3-toastify';
import { useHeaderStore } from '../pinia/header';

const transports = ref<Truck[]>([]);

const editedTruck = ref({
  id: 0,
  brand: '',
  model: '',
  registrationNumber: '',
  weight: 0,
  fuelType: '',
  euroStandard: 0,
});

const dialogVisible = ref(false);
const editedIndex = ref(-1);
const formTitle = computed(() => editedIndex.value === -1 ? 'Add Truck' : 'Edit Truck');

onMounted(() => {
  useHeaderStore().setTitle('Trucks');
  fetchTrucks();
});

const fetchTrucks = () => {
  fetch(`${serverUrl}/truck`)
    .then(response => response.json())
    .then(data => transports.value = data)
    .catch(error => {
      toast.error('Failed to fetch trucks');
      console.error('Failed to fetch trucks', error);
    });
};

const openEditDialog = (id: number) => {
  const truck = transports.value.find(truck => truck.id === id) as Truck;
  editedIndex.value = transports.value.indexOf(truck);
  editedTruck.value = { ...truck };
  console.log(editedTruck);
  dialogVisible.value = true;
};

const saveTruck = () => {
  const method = editedIndex.value === -1 ? 'POST' : 'PUT';
  const url = `${serverUrl}/truck`;
  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(editedTruck.value)
  })
    .then(response => response.json())
    .then(data => {
      if (editedIndex.value === -1) {
        transports.value.push(data);
      } else {
        transports.value[editedIndex.value] = data;
      }
      dialogVisible.value = false;
      toast.success('Truck saved successfully', { position: 'bottom-right' });
    })
    .catch(error => {
      toast.error('Failed to save truck details');
      console.error('Failed to save truck', error);
    });
};

const deleteTruck = (id: number) => {
  fetch(`${serverUrl}/truck/${id}`, { method: 'DELETE' })
    .then((res) => {
      if (!res.ok) throw new Error('Failed to delete client');
      transports.value = transports.value.filter(truck => truck.id !== id);
      toast.success('Truck deleted successfully');
    })
    .catch(error => {
      toast.error('Failed to delete truck');
      console.error('Failed to delete truck', error);
    });
};

const closeDialog = () => {
  dialogVisible.value = false;
};

const openDialog = () => {
  editedIndex.value = -1;
  editedTruck.value = {
    id: 0,
    brand: '',
    model: '',
    registrationNumber: '',
    weight: 0,
    fuelType: '',
    euroStandard: 0,
  };
  dialogVisible.value = true;
};

const searchQuery = ref('');

const filteredTrucks = computed(() => {
  if (!searchQuery.value) {
    return transports.value;
  }
  return transports.value.filter(truck => {
    return truck.brand.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      truck.model.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      truck.registrationNumber.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

</script>

<template>
  <div class="all-items-view-div">
    <div class="add-button-div">
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field v-model="searchQuery" label="Search" class="ml-6" variant="solo" density="compact"
            rounded></v-text-field>
        </v-col>
      </v-row>
      <v-btn color="primary" class="mr-5" @click="openDialog" variant="text">Add Truck</v-btn>
    </div>
    <div class="clients-list">
      <transport-item v-for="truck in filteredTrucks" :key="truck.id" :transport="truck" :editTransportProp="openEditDialog"
        :delete-transport-prop="deleteTruck" :isTrailer="false" />
    </div>
    <v-dialog v-model="dialogVisible" max-width="600px">
      <v-card>
        <v-card-title class="ma-2">{{ formTitle }} </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field v-model="editedTruck.brand" label="Brand"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="editedTruck.model" label="Model"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field v-model="editedTruck.registrationNumber" label="Registration Number"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="editedTruck.fuelType" label="Fuel type"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field v-model="editedTruck.euroStandard" label="Euro Standart"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="editedTruck.weight" label="Weight"></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" variant="text" @click="saveTruck">Save</v-btn>
          <v-btn color="red darken-1" variant="text" @click="closeDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped></style>
