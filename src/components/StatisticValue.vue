<script setup lang="ts">

const { value, title} = defineProps<{
    value: string,
    title: string
}>();

</script>

<template>
    <div class="statistic">
        <div class="statistic-value">{{ value }}</div>
        <div class="statistic-label">{{ title }}</div>
    </div>
</template>

<style scoped>
.statistic {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 1rem;
    border-radius: 8px;
    background-color: #f8f9fa;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.statistic-value {
    font-size: 1.5rem;
    font-weight: bold;
}

.statistic-label {
    color: #6c757d;
    font-weight: bold;
}
</style>