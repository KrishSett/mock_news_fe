<template>
    <div class="err-msg">Error Opening The Requested Resource -  {{ errorMessage }}</div>
</template>

<script setup>
import { computed } from 'vue';

const errorMessage = computed (() => props.error);

const props = defineProps({
    'error': {
        'type': String,
        'required': true,
        'default' : 'Oops! Something went wrong.'
    }
});
</script>

<style scoped lang="scss">
    .err-msg {
        text-align: center;
        font-size: 1.2rem;
        font-weight: 400;
        color: #444;
        padding: 2rem;
    }
</style>