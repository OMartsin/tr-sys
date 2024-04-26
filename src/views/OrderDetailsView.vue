<script setup lang="ts">
import { onMounted, ref } from 'vue';
import EntityItemWithoutOrders from '../components/EntityItemWithoutOrderList.vue';
import type { EntityForDetails, OrderForDetails } from '../types';
import { serverUrl } from '../const';
import { toast } from 'vue3-toastify'
import { useHeaderStore } from '../pinia/header';
import { useRoute } from 'vue-router';

const order = ref<OrderForDetails>({} as OrderForDetails);
const clientId = useRoute().params.id;
const thisEntity = ref<EntityForDetails | undefined>();

onMounted(() => {
  useHeaderStore().setTitle('Order');
  fetch(`${serverUrl}/order/${clientId}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch client');
      }
      return res.json();
    })
    .then((data) => {
      order.value = data;
      console.log(order.value);
      useHeaderStore().setTitle(order.value.name);
      thisEntity.value = {
        id: order.value.id,
        fields: new Map<string, string>(
            [
                ['Client name', order.value.clientName],
                ['Price', order.value.price.toString()],
                ['Departure date', order.value.departureDate.toString()],
                ['Trailer number', order.value.delivery.trailerNumber],
                ['Truck number', order.value.delivery.truckNumber],
                ['Driver', order.value.delivery.driverName],
                ['Status', order.value.delivery.deliveryLogs.length > 0 ? order.value.delivery.deliveryLogs[0].status : 'No logs']
            ]
        ),
        orders: []
      }
    })
    .catch((error) => {
      toast.error('Failed to fetch client', {
        position: toast.POSITION.BOTTOM_RIGHT
      })
      console.error(error);
    });
})

</script>

<template>
  <EntityItemWithoutOrders v-if="thisEntity" :entity="thisEntity" />
</template>

<style scoped></style>
