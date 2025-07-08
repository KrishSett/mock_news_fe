<template>
    <section class="page-details">
        <div v-if="errorMessage">
            <ErrorMessage :error="errorMessage"></ErrorMessage>
        </div>
        <div v-else>
            <div class="container">
                <BreadCrumb />
                <!-- Page Content -->
                <div class="container" v-if="isLoaded">
                    <h1 class="page-title">{{ page.title }}</h1>
                    <p class="description" v-html="page.description"></p>
                </div>
                <!-- Loading -->
                <div v-else class="loading">Loading...</div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { pageService } from '../common/page.service';
import { useAuthStore } from '../states/auth.states';
import BreadCrumb from '../components/BreadCrumb.vue';
import ErrorMessage from '../components/ErrorMessage.vue';

const route = useRoute();
const slug = route.params.slug;

const page = ref({});
const isLoaded = ref(false);
const errorMessage = ref(null);
const authStore = useAuthStore();
const auth = authStore.getAuthState;
const authorization = authStore.authorization;

const fetchPageDetails = async () => {
    if (!auth.isAuthenticated) {
        throw new Error("Authentication not completed");
    }

    return await pageService.getPageDetails(slug, {
        Authorization: `Bearer ${authorization}`,
        "X-AUTH-TYPE": auth.authType,
        "X-USER-ID": auth.visitorId,
    });
};

onMounted(async () => {
    try {
        const response = await fetchPageDetails();
        page.value = response;
    } catch (error) {
        console.error('Error loading page details:', error.message);
        errorMessage.value = error.message;
    } finally {
        isLoaded.value = true;
    }
});
</script>

<style scoped lang="scss">
.page-details {
    padding: 2rem;

    .page-title {
        position: relative;
        display: inline-block;
        font-size: 2rem;
        font-weight: 700;
        padding-bottom: 0.5rem;
        color: #2c3e50;
        margin-bottom: 3rem;
        margin-top: 1.5rem;
        text-transform: uppercase;

        &::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            width: 60px;
            height: 3px;
            background: #e74c3c;
        }
    }


    .description {
        font-size: 1.1rem;
        line-height: 1.6;
        color: #444;
    }

    .loading,
    .error-msg {
        text-align: center;
        padding: 2rem 0;
        font-size: 1.1rem;
        color: #999;
    }
}
</style>
