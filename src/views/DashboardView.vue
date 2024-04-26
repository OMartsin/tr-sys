<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Statistics } from '../types';
import StatisticValue from '../components/StatisticValue.vue';
import { useHeaderStore } from '../pinia/header';
import { VFrappeChart } from "vue-frappe-chart"
import { serverUrl } from '../const';


const statistics = ref({
  totalClients: 4,
  totalDrivers: 2,
  totalOrders: 10,
  totalProfit: 0
} as Statistics);

const profitStatistics = ref({
  totalProfit: 0,
  profitByMonths: [] as number[]  ,
  labels: [] as string[],
  colors: ['red']
});

const ordersStatistics = ref({
  totalOrders: 0,
  ordersByMonths: [] as number[],
  labels: [] as string[],
  colors: ['blue']
});

onMounted(() => {
  const store = useHeaderStore();
  store.setTitle('Dashboard');

  fetchAllStatistics()
})

function fetchAllStatistics() {
  fetch(`${serverUrl}/statistics/all?startDate=2023-01-01T00:00:00&endDate=2023-12-31T23:59:59`).then(response => {
    return response.json();
  }).then(data => {
    statistics.value.totalClients = data.common.totalClients;
    statistics.value.totalDrivers = data.common.totalDrivers;
    statistics.value.totalOrders = data.common.totalOrders;
    statistics.value.totalProfit = data.common.totalProfit as number;

    profitStatistics.value.totalProfit = data.profit.totalProfit;
    profitStatistics.value.profitByMonths = Object.values(data.profit.profit).map((value: unknown) => value as number);
    profitStatistics.value.labels = Object.keys(data.profit.profit);

    ordersStatistics.value.totalOrders = data.orders.totalOrders;
    ordersStatistics.value.ordersByMonths = Object.values(data.orders.ordersByMonth).map((value: unknown) => value as number);
    ordersStatistics.value.labels = Object.keys(data.orders.ordersByMonth);
  }).catch(error => {
    console.error('Error:', error);
  });
}


</script>

<template>
  <div class="dashboard">
    <h2>Main statistic</h2>
    <div class="statistics">
      <statistic-value title="Clients" :value="statistics.totalClients.toString()"></statistic-value>
      <statistic-value title="Drivers" :value="statistics.totalDrivers.toString()"></statistic-value>
      <statistic-value title="Orders this year" :value="statistics.totalClients.toString()"></statistic-value>
      <statistic-value title="Profit this year" :value="(Math.round(statistics.totalProfit * 100) / 100).toFixed(2) 
      + ' UAH' "></statistic-value>
    </div>
    <div class="profit-by-months-diagram">
      <h3>Profit diagram</h3>
      <div class="diagram-window">
        <v-frappe-chart type="line"  :labels="profitStatistics.labels"
          :data="[{ values: profitStatistics.profitByMonths }]" :colors="profitStatistics.colors" />
      </div>
    </div>
    <div class="orders-by-months-diagram">
      <h3>Orders number by months</h3>
      <div class="diagram-window">
        <v-frappe-chart type="line" :labels="ordersStatistics.labels"
          :data="[{ values: ordersStatistics.ordersByMonths }]" :colors="ordersStatistics.colors" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  overflow-y: scroll;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  height: 34rem;
  width: 100%;
  padding: 1.25rem;
  padding-top: 0;
  margin: 1rem;
}

h2 {
  align-self: flex-start;
  padding-left: 2rem;
}

.statistics {
  display: grid;
  gap: 2rem;
  width: 95%;
  grid-template-columns: repeat(4, 1fr);
}

.profit-by-months-diagram {
  width: 95%;
}

.orders-by-months-diagram {
  width: 95%;
}

.diagram-window {
  border-radius: 1rem;
}
</style>