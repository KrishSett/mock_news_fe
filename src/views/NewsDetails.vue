<template>
    <div>News Details</div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute();
const uuid = route.params.uuid;

console.log('news uuid', uuid)
</script>
