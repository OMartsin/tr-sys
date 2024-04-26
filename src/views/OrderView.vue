<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import OrderItem from '../components/OrderItem.vue';
import { idWithNames, OrderForDetails, type Order, type OrderInputDto } from '../types';
import { serverUrl } from '../const';
import { toast } from 'vue3-toastify'
import { useHeaderStore } from '../pinia/header';


const orders = ref<Order[]>([] as Order[]);
const editedIndex = ref(-1);
const editedOrder = ref<OrderInputDto>({
  id: undefined,
  name: '',
  clientId: undefined,
  price: 0,
  departureDate: new Date(),
  delivery: {
    id: undefined,
    truckId: undefined,
    trailerId: undefined,
    driverId: undefined,
  }
});

const clients = ref<idWithNames[]>([]);
const drivers = ref<idWithNames[]>([]);
const trucks = ref<idWithNames[]>([]);
const trailers = ref<idWithNames[]>([]);

useHeaderStore().setTitle('Orders');

onMounted(() => {
  startDate.value = new Date(0);
  endDate.value = new Date(8640000000000000);
  fetchDataForSelects();
  fetch(`${serverUrl}/order`)
    .then((res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch orders');
      }
      return res.json();
    })
    .then((data) => {
      orders.value = data.map((order: Order) => {
        return {
          id: order.id,
          name: order.name,
          clientName: order.clientName,
          price: order.price,
          departureDate: new Date(order.departureDate)
        }
      });
    })
    .catch((error) => {
      toast.error('Failed to fetch orders', {
        position: toast.POSITION.BOTTOM_RIGHT
      })
      console.error(error);
    });
})

const fetchDataForSelects = () => {
  fetch(`${serverUrl}/order/for-add-form`)
    .then((res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch data for selects');
      }
      return res.json();
    })
    .then((data) => {
      clients.value = data.clients;
      drivers.value = data.drivers;
      trucks.value = data.trucks;
      trailers.value = data.trailers;
      console.log(data);
      console.log(clients.value);
    })
    .catch((error) => {
      toast.error('Failed to fetch data for selects', {
        position: toast.POSITION.BOTTOM_RIGHT
      })
      console.error(error);
    });
}

const handleDelete = (id: number) => {
  fetch(`${serverUrl}/order/${id}`, {
    method: 'DELETE',
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Failed to delete client');
      }
      orders.value = orders.value.filter((order) => order.id !== id);
      toast.success('Order deleted successfully', {
        position: toast.POSITION.BOTTOM_RIGHT
      })
    })
    .catch((error) => {
      toast.error('Failed to delete order', {
        position: toast.POSITION.BOTTOM_RIGHT
      })
      console.error(error);
    });
};

const dialogVisible = ref(false);

const startDate = ref(new Date());
const endDate = ref(new Date());

const filteredOrders = computed(() => {
  return orders.value.filter((order) => {
    return order.departureDate >= startDate.value && order.departureDate <= endDate.value;
  }).sort((a, b) => {
    return b.departureDate.getTime() - a.departureDate.getTime();
  });
});

const openDialog = () => {
  editedOrder.value = {
    id: undefined,
    name: '',
    clientId: undefined,
    price: 0,
    departureDate: new Date(),
    delivery: {
      id: undefined,
      truckId: undefined,
      trailerId: undefined,
      driverId: undefined,
    }
  };
  editedIndex.value = -1;
  dialogVisible.value = true;
};

const closeDialog = () => {
  dialogVisible.value = false;
};

const handleEdit = (order: Order) => {
  console.log("Edit order")
  editedIndex.value = orders.value.indexOf(order);
  let fetchOrder = {} as OrderForDetails;
  fetch(`${serverUrl}/order/${order.id}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch order');
      }
      return res.json();
    })
    .then((data) => {
      fetchOrder = { ...data };
      const clientId = clients.value.find((client) => client.name === fetchOrder.clientName)?.id;
      const truckId = trucks.value.find((truck) => truck.name === fetchOrder.delivery.truckNumber)?.id;
      const trailerId = trailers.value.find((trailer) => trailer.name === fetchOrder.delivery.trailerNumber)?.id;

      editedOrder.value = {
        id: fetchOrder.id,
        name: fetchOrder.name,
        clientId: clientId,
        price: fetchOrder.price,
        departureDate: fetchOrder.departureDate,
        delivery: {
          id: fetchOrder.delivery.id,
          truckId: truckId,
          trailerId: trailerId,
          driverId: -1
        }
      };
    })
    .catch((error) => {
      toast.error('Failed to fetch order', {
        position: toast.POSITION.BOTTOM_RIGHT
      })
      console.error(error);
    });
  dialogVisible.value = true;
};

const saveOrder = () => {
  const method = editedIndex.value === -1 ? 'POST' : 'PUT';
  editedOrder.value.clientId = selectedClientId.value;
  editedOrder.value.delivery.driverId = selectedDriverId.value;
  editedOrder.value.delivery.truckId = selectedTruckId.value;
  editedOrder.value.delivery.trailerId = selectedTrailerId.value;
  console.log(editedOrder.value);
  fetch(`${serverUrl}/order`, {
    method: `${method}`,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(editedOrder.value),
  })
    .then(response => response.json())
    .then(data => {
      data.departureDate = new Date(data.departureDate);
      if (editedIndex.value === -1) {
        orders.value.push(data);
      } else {
        orders.value[editedIndex.value] = data;
      }
      editedIndex.value = -1;
      toast.success('Order saved successfully', {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    })
    .catch(error => {
      console.error('Failed to save order', error)
      toast.error('Failed to save order', {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    });
  dialogVisible.value = false;
}

const formTitle = computed(() => {
  return editedIndex.value === -1 ? 'Add Order' : 'Edit Order';
});

const editedClientName = ref('');
const editedDriverName = ref('');
const editedTruckNumber = ref('');
const editedTrailerNumber = ref('');

const selectedClientId = computed(() => {
  const client = clients.value.find(c => c.name === editedClientName.value);
  return client ? client.id : 0;
});

const selectedDriverId = computed(() => {
  const driver = drivers.value.find(d => d.name === editedDriverName.value);
  return driver ? driver.id : 0;
});

const selectedTruckId = computed(() => {
  const truck = trucks.value.find(t => t.name === editedTruckNumber.value);
  return truck ? truck.id : 0;
});

const selectedTrailerId = computed(() => {
  const trailer = trailers.value.find(t => t.name === editedTrailerNumber.value);
  return trailer ? trailer.id : 0;
});

const format = 'yyyy-MM-dd';

const dateOptions = ref(['Today', 'This Week', 'This Month', 'This Year', 'All Time']);

const dateOption = ref('All time');

watch(dateOption, (newVal) => {
  const today = new Date();
  switch (newVal) {
    case 'Today':
      startDate.value = new Date(today.setHours(0, 0, 0, 0));
      endDate.value = new Date(today.setHours(23, 59, 59, 999));
      break;
    case 'This Week':
      startDate.value = new Date(today.setDate(today.getDate() - today.getDay()));
      endDate.value = new Date(today.setDate(today.getDate() + 6));
      break;
    case 'This Month':
      startDate.value = new Date(today.setDate(1));
      endDate.value = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      break;
    case 'This Year':
      startDate.value = new Date(today.getFullYear(), 0, 1);
      endDate.value = new Date(today.getFullYear(), 11, 31);
      break;
    case 'All Time':
      startDate.value = new Date(0);
      endDate.value = new Date(8640000000000000);
      break;
  }
});
</script>

<template>
  <div class="all-items-view-div">
    <div class="header">
      <v-row>
        <v-col cols="5">
          <v-select v-model="dateOption" :items="dateOptions" density="comfortable" class="ml-2" label="Filter"
            variant="solo" rounded></v-select>
        </v-col>
      </v-row>
      <v-btn color="primary" class="font-weight-black mb-5" variant="text" @click="openDialog">Add Order</v-btn>
    </div>
    <div class="orders-list">
      <order-item v-for="order in filteredOrders" :key="order.id" :order="order" @edit="handleEdit"
        @delete="handleDelete" />
      <div v-if="filteredOrders.length === 0" class="no-orders">No orders found</div>
    </div>
    <v-dialog v-model="dialogVisible" max-width="600px">
      <v-card>
        <v-card-title class="ma-2">{{ formTitle }} </v-card-title>
        <v-card-text>
          <v-text-field v-model="editedOrder.name" label="Order Name"></v-text-field>
          <v-text-field v-model="editedOrder.price" label="Price" type="number"></v-text-field>
          <VueDatePicker class="pr-1 pl-1 pb-4" v-model="editedOrder.departureDate" locale="uk" hide-offset-dates
            :enable-time-picker="false" :format="format" auto-apply required />
          <v-row>
            <v-col cols="6">
              <v-select v-model="editedClientName" :items="clients.map(a => a.name)" label="Client"></v-select>
            </v-col>
            <v-col cols="6">
              <v-select v-model="editedDriverName" :items="drivers.map(a => a.name)" label="Driver"></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-select v-model="editedTruckNumber" :items="trucks.map(a => a.name)" label="Truck"></v-select>
            </v-col>
            <v-col cols="6">
              <v-select v-model="editedTrailerNumber" :items="trailers.map(a => a.name)" label="Trailer"></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" variant="text" @click="saveOrder">Save</v-btn>
          <v-btn color="red darken-1" variant="text" @click="closeDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
  width: 100%;
}

.orders-list {
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  width: 100%;
  height: 28rem;
  gap: 10px;
  padding: 1.25rem;
  padding-top: 0;
  margin: 0.5rem;
}

.no-orders {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 1.5rem;
  color: #333;
}
</style>