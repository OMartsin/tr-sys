<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import ClientItem from '../components/ClientItem.vue';
import { Client } from '../types';
import { serverUrl } from '../const';
import { toast } from 'vue3-toastify';
import { useHeaderStore } from '../pinia/header';

const clients = ref<Client[]>([]);

const editedClient = ref<Client>({
  id: 0,
  name: '',
  address: '',
  edrpou: '',
  ipn: '',
  iban: '',
  bank: '',
  mfo: '',
  orders: []
});

const editedIndex = ref(-1);
const dialogVisible = ref(false);

onMounted(() => {
  useHeaderStore().setTitle('Clients');
  fetchClients();
});

const fetchClients = () => {
  fetch(`${serverUrl}/client`)
    .then(res => res.json())
    .then(data => clients.value = data)
    .catch(error => {
      toast.error('Failed to fetch clients');
      console.error('Failed to fetch clients', error);
    });
};

const openEditDialog = (id: number) => {
  const client = clients.value.find(client => client.id === id);
  if (client) {
    editedIndex.value = clients.value.indexOf(client);
    editedClient.value = { ...client };
    dialogVisible.value = true;
  }
};

const openDialog = () => {
  editedIndex.value = -1;
  editedClient.value = {
    id: 0,
    name: '',
    address: '',
    edrpou: '',
    ipn: '',
    iban: '',
    bank: '',
    mfo: '',
    orders: []
  };
  dialogVisible.value = true;
};

const saveClient = () => {
  const method = editedIndex.value >= 0 ? 'PUT' : 'POST';
  const url = `${serverUrl}/client${editedIndex.value >= 0 ? `/${editedClient.value.id}` : ''}`;
  fetch(url, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(editedClient.value)
  })
    .then(res => res.json())
    .then(data => {
      if (method === 'POST') {
        clients.value.push(data);
      } else {
        clients.value[editedIndex.value] = data;
      }
      dialogVisible.value = false;
      toast.success(`Client ${method === 'POST' ? 'added' : 'updated'} successfully`);
    })
    .catch(error => {
      toast.error(`Failed to ${method === 'POST' ? 'add' : 'update'} client`);
      console.error(`Failed to ${method === 'POST' ? 'add' : 'update'} client`, error);
    });
};

const deleteClient = (id: number) => {
  fetch(`${serverUrl}/client/${id}`, { method: 'DELETE' })
    .then(res => {
      if (!res.ok) throw new Error('Failed to delete client');
      clients.value = clients.value.filter(client => client.id !== id);
      toast.success('Client deleted successfully');
    })
    .catch(error => {
      toast.error('Failed to delete client');
      console.error('Failed to delete client', error);
    });
};

const closeDialog = () => {
  dialogVisible.value = false;
};

const formTitle = computed(() => editedIndex.value === -1 ? 'Add Client' : 'Edit Client');

const searchQuery = ref('');

const filteredClients = computed(() => {
  if (!searchQuery.value) {
    return clients.value;
  }
  return clients.value.filter(client =>
    client.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
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
      <v-btn color="primary" class="mr-5" @click="openDialog" variant="text">Add Client</v-btn>
    </div>
    <div class="clients-list">
      <client-item v-for="client in filteredClients" :key="client.id" :client="client" @edit="openEditDialog"
        @delete="deleteClient" />
    </div>
    <v-dialog v-model="dialogVisible" max-width="600px">
      <v-card>
        <v-card-title class="ma-2">{{ formTitle }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field v-model="editedClient.name" label="Name"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="editedClient.address" label="Address"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field v-model="editedClient.edrpou" label="EDRPOU"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="editedClient.ipn" label="IPN"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field v-model="editedClient.iban" label="IBAN"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="editedClient.bank" label="Bank"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field v-model="editedClient.mfo" label="MFO"></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="saveClient" variant="text" color="blue darken-1">Save</v-btn>
          <v-btn @click="closeDialog" variant="text" color="red darken-1">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>


<style scoped></style>