<script setup lang="ts">
import { onMounted, ref } from 'vue';
import EntityItemWithoutOrders from '../components/EntityItemWithoutOrderList.vue';
import type { Truck, EntityForDetails, Order, Delivery } from '../types';
import { serverUrl } from '../const';
import { toast } from 'vue3-toastify'
import { useHeaderStore } from '../pinia/header';
import { useRoute } from 'vue-router';

const truck = ref<Truck>({} as Truck);
const truckId = useRoute().params.id;
const thisEntity = ref<EntityForDetails | undefined>();

onMounted(() => {
    useHeaderStore().setTitle('Truck');
    fetch(`${serverUrl}/truck/${truckId}`)
        .then((res) => {
            if (!res.ok) {
                throw new Error('Failed to fetch trucks');
            }
            return res.json();
        })
        .then((data) => {
            truck.value = data;
            console.log(truck.value);
            useHeaderStore().setTitle(truck.value.brand + ' ' + truck.value.model);
            thisEntity.value = {
                id: truck.value.id,
                fields: new Map<string, string>([
                    ['Registration number', truck.value.registrationNumber],
                    ['Brand', truck.value.brand],
                    ['Model', truck.value.model],
                    ['Euro standart', "EURO " + truck.value.euroStandard.toString()],
                    ['Fuel type', truck.value.fuelType],
                ]),
                orders: []
            }
        })
        .catch((error) => {
            toast.error('Failed to fetch truck', {
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
