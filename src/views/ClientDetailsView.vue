<script setup lang="ts">
import { onMounted, ref } from 'vue';
import EntityItem from '../components/EntityDetails.vue';
import type { Client, EntityForDetails, Order } from '../types';
import { serverUrl } from '../const';
import { toast } from 'vue3-toastify'
import { useHeaderStore } from '../pinia/header';
import { useRoute } from 'vue-router';

const client = ref<Client>({} as Client);
const clientId = useRoute().params.id;
const thisEntity = ref<EntityForDetails | undefined>();

onMounted(() => {
  useHeaderStore().setTitle('Client');
  fetch(`${serverUrl}/client/${clientId}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch client');
      }
      return res.json();
    })
    .then((data) => {
      client.value = data;
      console.log(client.value);
      useHeaderStore().setTitle(client.value.name);
      thisEntity.value = {
        id: client.value.id,
        fields: new Map<string, string>([
          ['Address', client.value.address],
          ['EDRPOU', client.value.edrpou],
          ['Iban', client.value.iban],
          ['Bank', client.value.bank],
          ['Ipn', client.value.ipn],
          ['Mfo', client.value.mfo]
        ]),
        orders: client.value.orders.map((order: Order) => {
          return {
            id: order.id,
            name: order.name,
            clientName: order.clientName,
            price: order.price,
            departureDate: new Date(order.departureDate)
          }
        })
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
  <EntityItem v-if="thisEntity" :entity="thisEntity" />
</template>

<style scoped></style>
