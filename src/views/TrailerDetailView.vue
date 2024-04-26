<script setup lang="ts">
import { onMounted, ref } from 'vue';
import EntityItemWithoutOrders from '../components/EntityItemWithoutOrderList.vue';
import type { Trailer, EntityForDetails, Order, Delivery } from '../types';
import { serverUrl } from '../const';
import { toast } from 'vue3-toastify'
import { useHeaderStore } from '../pinia/header';
import { useRoute } from 'vue-router';

const trailer = ref<Trailer>({} as Trailer);
const trailerId = useRoute().params.id;
const thisEntity = ref<EntityForDetails | undefined>();

onMounted(() => {
  useHeaderStore().setTitle('Trailers');
  fetch(`${serverUrl}/trailer/${trailerId}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch trailers');
      }
      return res.json();
    })
    .then((data) => {
      trailer.value = data;
      console.log(trailer.value);
      useHeaderStore().setTitle(trailer.value.brand + ' ' + trailer.value.model);
      thisEntity.value = {
        id: trailer.value.id,
        fields: new Map<string, string>([
          ['Registration number', trailer.value.registrationNumber],
          ['Brand', trailer.value.brand],
          ['Model', trailer.value.model],
          ['Capacity', trailer.value.capacity.toString()],
          ['Type', trailer.value.trailerType]
        ]),
        orders: []
      }
    })
    .catch((error) => {
      toast.error('Failed to fetch trailer', {
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
