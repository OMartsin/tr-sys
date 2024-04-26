<script setup lang="ts">
import { onMounted, ref } from 'vue';
import EntityItem from '../components/EntityDetails.vue';
import type { Driver, EntityForDetails, Order } from '../types';
import { serverUrl } from '../const';
import { toast } from 'vue3-toastify'
import { useHeaderStore } from '../pinia/header';
import { useRoute } from 'vue-router';

const client = ref<Driver>({} as Driver);
const clientId = useRoute().params.id;
const thisEntity = ref<EntityForDetails | undefined>();

onMounted(() => {
    useHeaderStore().setTitle('Driver');
    fetch(`${serverUrl}/driver/${clientId}`)
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
                    ['Full name', client.value.name + " " + client.value.surname + " " + client.value.patronymic],
                    ['Passport', client.value.passportNumber],
                    ['Phone', client.value.phoneNumber],
                    ['Nationality', client.value.nationality],
                    ['IPN', client.value.ipn],
                    ['License number', client.value.driverLicenses[0]? client.value.driverLicenses[0].number : 
                                                            "No license number"],
                    ['License categories', client.value.driverLicenses[0]? client.value.driverLicenses[0].licenseCategories : 
                                                            "No license categories"],
                ]),
                orders: client.value.orders?.map((order: Order) => {
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
