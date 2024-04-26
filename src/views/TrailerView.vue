<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import TransportItem from '../components/TransportItem.vue';
import { Trailer } from '../types'; // Make sure this import reflects the Trailer structure
import { serverUrl } from '../const';
import { toast } from 'vue3-toastify';
import { useHeaderStore } from '../pinia/header';

const trailers = ref<Trailer[]>([]);

const editedTrailer = ref({
  id: 0,
  brand: '',
  model: '',
  registrationNumber: '',
  weight: 0,
  capacity: 0,
  trailerType: ''
});

const editedIndex = ref(-1);

const dialogVisible = ref(false);

onMounted(() => {
  useHeaderStore().setTitle('Trailers');
  fetchTrailers();
});

const fetchTrailers = () => {
  fetch(`${serverUrl}/trailer`)
    .then(response => response.json())
    .then(data => trailers.value = data)
    .catch(error => {
      toast.error('Failed to fetch trailers');
      console.error('Failed to fetch trailers', error);
    });
};

const openEditDialog = (id: number) => {
  const truck = trailers.value.find(truck => truck.id === id) as Trailer;
  editedIndex.value = trailers.value.indexOf(truck);
  editedTrailer.value = { ...truck };
  console.log(editedTrailer);
  dialogVisible.value = true;
};

const openDialog = () => {
  editedIndex.value = -1;
  editedTrailer.value = {
    id: 0,
    brand: '',
    model: '',
    registrationNumber: '',
    weight: 0,
    capacity: 0,
    trailerType: ''
  };
  dialogVisible.value = true;
};

const saveTrailer = () => {
  const method = editedIndex.value ? 'PUT' : 'POST';
  const url = `${serverUrl}/trailer`;
  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(editedTrailer)
  })
    .then(response => response.json())
    .then(data => {
      if (method === 'POST') {
        trailers.value.push(data);
      } else {
        trailers.value[editedIndex.value] = data;
      }
      dialogVisible.value = false;
      toast.success('Trailer updated successfully');
    })
    .catch(error => {
      toast.error('Failed to save trailer details');
      console.error('Failed to save trailer', error);
    });
};

const deleteTrailer = (id: number) => {
  fetch(`${serverUrl}/trailer/${id}`, { method: 'DELETE' })
    .then((res) => {
      if (!res.ok) throw new Error('Failed to delete client');
      trailers.value = trailers.value.filter(trailer => trailer.id !== id);
      toast.success('Trailer deleted successfully');
    })
    .catch(error => {
      toast.error('Failed to delete trailer');
      console.error('Failed to delete trailer', error);
    });
};

const closeDialog = () => {
  dialogVisible.value = false;
};

const formTitle = computed(() => editedIndex.value === -1 ? 'Add Trailer' : 'Edit Trailer');

const searchQuery = ref('');

const filteredTrailers = computed(() => {
  if (!searchQuery.value) {
    return trailers.value;
  }
  return trailers.value.filter(trailer => {
    return trailer.brand.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      trailer.model.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      trailer.registrationNumber.toLowerCase().includes(searchQuery.value.toLowerCase());
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
      <v-btn color="primary" class="mr-5" @click="openDialog" variant="text">Add Trailer</v-btn>
    </div>
    <div class="clients-list">
      <transport-item v-for="trailer in filteredTrailers" :key="trailer.id" :transport="trailer"
        :editTransportProp="openEditDialog" :delete-transport-prop="deleteTrailer" :isTrailer="true" />
    </div>
    <v-dialog v-model="dialogVisible" max-width="600px">
      <v-card>
        <v-card-title class="ma-2">{{ formTitle }} </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field v-model="editedTrailer.brand" label="Brand"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="editedTrailer.model" label="Model"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field v-model="editedTrailer.registrationNumber" label="Registration Number"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="editedTrailer.trailerType" label="Trailer Type"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field v-model="editedTrailer.capacity" label="Capacity"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="editedTrailer.weight" label="Weight"></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" variant="text" @click="saveTrailer">Save</v-btn>
          <v-btn color="red darken-1" variant="text" @click="closeDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped></style>