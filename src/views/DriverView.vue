<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { Driver, DriverLicense } from '../types';
import { serverUrl } from '../const';
import { toast } from 'vue3-toastify';
import { useHeaderStore } from '../pinia/header';
import VueDatePicker from '@vuepic/vue-datepicker';
import DriverItem from '../components/DriverItem.vue';

const drivers = ref<Driver[]>([]);

const dialog = ref(false);
const editedIndex = ref(-1);
const editedItem = ref({
  id: 0,
  name: '',
  surname: '',
  patronymic: '',
  passportNumber: '',
  nationality: '',
  phoneNumber: '',
  ipn: '',
  driverLicenses: [] as DriverLicense[]
});

onMounted(() => {
  const headerStore = useHeaderStore();
  headerStore.setTitle('Drivers');
  fetchDrivers();
});

const fetchDrivers = () => {
  fetch(`${serverUrl}/driver`)
    .then(response => response.json())
    .then(data => {
      drivers.value = data
      console.log(data);
    })
    .catch(error => {
      toast.error('Failed to fetch drivers');
      console.error('Failed to fetch drivers', error);
    });
};

const openDialog = (driver?: Driver) => {
  if (driver) {
    editedIndex.value = drivers.value.indexOf(driver);
    editedItem.value.id = driver.id;
    editedItem.value.name = driver.name;
    editedItem.value.surname = driver.surname;
    editedItem.value.patronymic = driver.patronymic;
    editedItem.value.passportNumber = driver.passportNumber;
    editedItem.value.nationality = driver.nationality;
    editedItem.value.phoneNumber = driver.phoneNumber;
    editedItem.value.ipn = driver.ipn;
    editedItem.value.driverLicenses = driver.driverLicenses;
  } else {
    Object.assign(editedItem, {
      id: 0,
      name: '',
      surname: '',
      patronymic: '',
      passportNumber: '',
      nationality: '',
      phoneNumber: '',
      ipn: '',
      driverLicenses: []
    });
    editedIndex.value = -1;
  }
  dialog.value = true;
};

const addLicense = () => {
  if (!editedItem.value.driverLicenses) {
    editedItem.value.driverLicenses = [{
      id: null as any,
      number: '',
      licenseCategories: '',
      issueDate: new Date(),
      expirationDate: new Date()
    }];
  }
  else {
    editedItem.value.driverLicenses.push({
      id: null as any,
      number: '',
      licenseCategories: '',
      issueDate: new Date(),
      expirationDate: new Date()
    });
  }
};

const removeLicense = (index: number) => {
  editedItem.value.driverLicenses.splice(index, 1);
};

const saveDriver = () => {
  const method = editedIndex.value === -1 ? 'POST' : 'PUT';
  fetch(`${serverUrl}/driver`, {
    method: `${method}`,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(editedItem.value),
  })
    .then(response => response.json())
    .then(data => {
      if (editedIndex.value === -1) {
        drivers.value.push(data);
      } else {
        drivers.value[editedIndex.value] = data;
      }
      dialog.value = false;
    })
    .catch(error => {
      console.error('Failed to save driver', error)
      toast.error('Failed to save driver');
    });
};

const deleteDriver = (id: number) => {
  fetch(`${serverUrl}/driver/${id}`, {
    method: 'DELETE',
  })
    .then((res) => {
      if (!res.ok) throw new Error('Failed to delete client');
      drivers.value = drivers.value.filter(driver => driver.id !== id);
    })
    .catch(error => {
      console.error('Failed to delete driver', error)
      toast.error('Failed to delete driver');
    });
};

const editItem = (driver: Driver) => {
  fetch(`${serverUrl}/driver/${driver.id}`)
    .then(response => response.json())
    .then(data => {
      editedIndex.value = drivers.value.indexOf(driver);
      editedItem.value = { ...data };
      dialog.value = true;
    })
    .catch(error => {
      console.error('Failed to edit driver', error)
      toast.error('Failed to edit driver');
    });
  editedIndex.value = drivers.value.indexOf(driver);
  editedItem.value = { ...driver };
  dialog.value = true;
};

const formTitle = computed(() => editedIndex.value === -1 ? 'New Driver' : 'Edit Driver');

const searchQuery = ref('');
const filteredDrivers = computed(() => {
  if (!searchQuery.value) {
    return drivers.value;
  }
  return drivers.value.filter(driver => {
    const fullName = `${driver.name} ${driver.surname} ${driver.patronymic}`.toLowerCase();
    return fullName.toLowerCase().includes(searchQuery.value.toLowerCase())
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
      <v-btn color="primary" class="mr-5" @click="openDialog" variant="text">Add Driver</v-btn>
    </div>
    <div class="clients-list">
      <driver-item v-for="driver in filteredDrivers" :key="driver.id" :driver="driver" :edit="editItem"
        :deleteDriverProp="deleteDriver" />
    </div>

    <v-dialog v-model="dialog" persistent max-width="900px">
      <v-card>
        <v-card-title class="mt-4 ml-4">
          {{ formTitle }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field v-model="editedItem.name" label="Name" />
            </v-col>
            <v-col>
              <v-text-field v-model="editedItem.surname" label="Surname" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field v-model="editedItem.patronymic" label="Patronymic" />
            </v-col>
            <v-col>
              <v-text-field v-model="editedItem.passportNumber" label="Passport Number" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field v-model="editedItem.nationality" label="Nationality" />
            </v-col>
            <v-col>
              <v-text-field v-model="editedItem.phoneNumber" label="Phone Number" />
            </v-col>
          </v-row>
          <v-text-field v-model="editedItem.ipn" label="IPN" />
          <v-divider />
          <v-btn color="green" variant="text" @click="addLicense">Add License</v-btn>
          <div v-for="(license, index) in editedItem.driverLicenses" :key="license.id" class="my-2">
            <h3 class="ma-4">License {{ index + 1 }}</h3>
            <v-text-field v-model="license.number" label="License Number" />
            <v-text-field v-model="license.licenseCategories" label="Categories" />
            <v-label>Issue Date</v-label>
            <VueDatePicker v-model="license.issueDate" label="Issue Date" />
            <v-label>Expiration Date</v-label>
            <VueDatePicker v-model="license.expirationDate" label="Expiration Date" />
            <div class="remove-button-div">
              <v-btn color="red" variant="text" @click="removeLicense(index)">Remove License</v-btn>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" variant="text" @click="saveDriver">Save</v-btn>
          <v-btn color="red" variant="text" @click="dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.remove-button-div {
  display: flex;
  justify-content: flex-end;
}
</style>
