<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { FinanceOperation } from '../types';
import { serverUrl } from '../const';
import { toast } from 'vue3-toastify';
import VueDatePicker from '@vuepic/vue-datepicker';
import { useHeaderStore } from '../pinia/header';

const financeOperations = ref<FinanceOperation[]>([]);
const dialog = ref(false);
const editedIndex = ref(-1);
const editedItem = ref({ id: 0, name: '', description: '', amount: 0, timestamp: new Date(), type: '' });

const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Name', value: 'name' },
  { title: 'Amount', value: 'amount' },
  { title: 'Timestamp', value: 'timestamp' },
  { title: 'Type', value: 'type' },
  { title: 'Actions', value: 'actions', sortable: false },
];

const itemsPerPage = ref(5);
const page = ref(0);

const fetchFinanceOperations = async (page: number, itemsPerPage: number) => {
  const response = await fetch(`${serverUrl}/finance-operations?page=${page}&size=${itemsPerPage}`);
  const data = await response.json();
  financeOperations.value = data.content;
  totalItems.value = data.totalElements;
  console.log(data.totalElements);
};

onMounted(() => {
  const headerStore = useHeaderStore();
  headerStore.setTitle('Finance Operations');
  fetchFinanceOperations(page.value, itemsPerPage.value).then(() => {
    loading.value = false;
  })
});

const openDialog = () => {
  editedItem.value = { id: 0, name: '', description: '', amount: 0, timestamp: new Date(), type: '' };
  editedIndex.value = -1;
  dialog.value = true;
};

const editItem = (item: FinanceOperation) => {
  editedIndex.value = financeOperations.value.indexOf(item);
  editedItem.value = { ...item };
  dialog.value = true;
};

const deleteItem = (item: FinanceOperation) => {
  fetch(`${serverUrl}/finance-operations/${item.id}`, {
    method: 'DELETE',
  })
    .then(() => {
      financeOperations.value = financeOperations.value.filter(operation => operation.id !== item.id);
    })
    .catch(error => {
      console.error('Failed to delete finance operation', error)
      toast.error('Failed to delete finance operation');
    });
};

const close = () => {
  dialog.value = false;
};

// rewrite to send data to the server

const save = () => {
  const method = editedIndex.value === -1 ? 'POST' : 'PUT';
  fetch(`${serverUrl}/finance-operations`, {
    method: `${method}`,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(editedItem.value),
  })
    .then(response => response.json())
    .then(data => {
      if (editedIndex.value === -1) {
        financeOperations.value.push(data);
      } else {
        financeOperations.value[editedIndex.value] = data;
      }
      close();
    })
    .catch(error => {
      console.error('Failed to save finance operation', error)
      toast.error('Failed to save finance operation');
    });
  close();
};

const formTitle = computed(() => editedIndex.value === -1 ? 'New Operation' : 'Edit Operation');

const rules = {
  required: (value: string) => !!value || 'Required.',
  doubleNumber: (value: string) => /^\d+(\.\d{1,2})?$/.test(value) || 'Must be a number with 2 decimal places. (xxx.xx)',
  maxSizeDesc: (value: string) => value.length <= 160 || 'Max 160 characters',
  maxSize32: (value: string) => value.length <= 32 || 'Max 32 characters',
};

const format = 'dd.MM.yyyy'

const expanded = ref([]);

const onClick = () => {
  loading.value = true
  fetchFinanceOperations(page.value, itemsPerPage.value).then(() => {
    loading.value = false;
  })
};

const loadItems = (options: { page: number, itemsPerPage: number }) => {
  loading.value = true;
  fetchFinanceOperations(options.page - 1, options.itemsPerPage).then(() => {
    loading.value = false;
  });
};

const getColor = (value: number) => {
  return value >= 0 ? 'green' : 'red';
};

const loading = ref(false);

const totalItems = ref(0);

const search = ref('');

</script>

<template>
  <v-data-table-server :headers="headers" :items="financeOperations" v-model:expanded="expanded" show-expand
    :loading="loading" @update:options="loadItems" :items-length="totalItems" v-model:items-per-page="itemsPerPage"
    class="elevation-1 table ">
    <template v-slot:top>
      <v-toolbar flat>
        <v-btn :disabled="loading" append-icon="mdi-refresh" text="Refresh" variant="outlined" @click="onClick"></v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark @click="openDialog">
          Add Operation
        </v-btn>
      </v-toolbar>
      <!-- <v-toolbar flat>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
      </v-toolbar> -->
    </template>
    <template v-slot:item.timestamp="{ item }">
      {{ new Date(item.timestamp).toLocaleDateString() }}
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)" icon="mdi-pencil">
      </v-icon>
      <v-icon small @click="deleteItem(item)" icon="mdi-delete">
      </v-icon>
    </template>
    <template v-slot:expanded-row="{ columns, item }">
      <tr>
        <td :colspan="columns.length">
          {{ item.description }}
        </td>
      </tr>
    </template>
    <template v-slot:item.amount="{ value }">
      <v-chip :color="getColor(value)">
        {{ value }}
      </v-chip>
    </template>
  </v-data-table-server>

  <v-dialog v-model="dialog" max-width="600px">
    <v-card class="rounded-lg">
      <v-card-title class="">
        <div class="headline pt-8 pl-3">{{ formTitle }}</div>
      </v-card-title>
      <v-card-text>
        <v-container class="pa-0">
          <v-col class="pa-0">
            <v-text-field v-model="editedItem.name" label="Operation Name"
              :rules="[rules.required, rules.maxSize32]"></v-text-field>
          </v-col>
          <v-col class="pa-0">
            <v-text-field v-model="editedItem.amount" label="Amount"
              :rules="[rules.required, rules.doubleNumber]"></v-text-field>
          </v-col>
          <v-col class="pa-0">
            <v-text-field v-model="editedItem.type" label="Type"
              :rules="[rules.required, rules.maxSize32]"></v-text-field>
          </v-col>
          <v-col class="pa-0 py-3">
            <VueDatePicker locale="uk" v-model="editedItem.timestamp" hide-offset-dates :enable-time-picker="false"
              :format="format" auto-apply required />
          </v-col>
          <v-col class="pa-0">
            <v-textarea v-model="editedItem.description" label="Description" :rules="[rules.maxSizeDesc]"></v-textarea>
          </v-col>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" variant="text" @click="close">Cancel</v-btn>
        <v-btn color="blue darken-1" variant="text" @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>



<style scoped>
.table {
  height: 36.25rem;
}
</style>