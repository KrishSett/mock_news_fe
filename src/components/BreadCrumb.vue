<template>
    <nav class="breadcrumb">
        <button class="back-button" @click="goBack">← Back</button>
        <span class="breadcrumb-label">{{ breadcrumbs.meta?.breadcrumb || breadcrumbs.name }}</span>
    </nav>
</template>

<script setup>
import { useNavStore } from '../states/nav.states';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const navStore = useNavStore();
const router = useRouter();

const breadcrumbs = computed(() => {
    const bcArr = navStore.getBreadcrumbs;
    return bcArr[bcArr.length - 1] || {};
});

function goBack() {
    router.replace('/');
}
</script>

<style scoped lang="scss">
.breadcrumb {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 0;
    font-size: 0.95rem;
    color: #555;

    .back-button {
        background: none;
        border: none;
        color: #3498db;
        font-weight: 500;
        cursor: pointer;
        padding: 0;
        font-size: 0.95rem;

        &:hover {
            text-decoration: underline;
        }
    }

    .breadcrumb-label {
        font-weight: 600;
        color: #2c3e50;
        text-transform: capitalize;
    }
}
</style>
