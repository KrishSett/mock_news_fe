<template>
    <section class="news-details">
        <div class="container" v-if="isLoaded">
            <h1 class="title">{{ news.title }}</h1>
            <p class="text-muted">{{ news.created_at }}</p>

            <div class="thumbnail" v-if="news.thumbnail?.src">
                <img :src="imgSrc" :alt="news.thumbnail.alt"
                    :style="{ backgroundImage: `url('${news.thumbnail.placeholder_image}')` }" class="lazy-image" />
            </div>

            <div class="description" v-html="news.description"></div>

            <div class="tags" v-if="news.tags?.length">
                <span class="tag" v-for="tag in news.tags" :key="tag.id">
                    #{{ tag.slug }}
                </span>
            </div>
        </div>
        <div v-else class="loading">Loading...</div>
    </section>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { newsService } from '../common/news.service';
import { useAuthStore } from '../states/auth.states';

const route = useRoute()
const uuid = route.params.uuid

const news = ref({});
const isLoaded = ref(false);
const authStore = useAuthStore();
const auth = authStore.getAuthState;
const authorization = authStore.authorization;
const imgSrc = ref(null);

watch(() => news.value.thumbnail?.src, (src) => {
    if (src) imgSrc.value = src;
});


const fetchNewsDetails = async () => {
    if (!auth.isAuthenticated) {
        throw new Error("Authentication not completed");
    }

    return await newsService.getNewsDetails(uuid, {
        "Authorization": `Bearer ${authorization}`,
        "X-AUTH-TYPE": auth.authType,
        "X-USER-ID": auth.visitorId
    });
};

onMounted(async () => {
    try {
        const response = await fetchNewsDetails();
        news.value = response;
        imgSrc.value = news.value.thumbnail.placeholder_image;
    } catch (error) {
        console.error('Error', error);
        news.value = {};
    } finally {
        isLoaded.value = true;
    }
});
</script>

<style scoped lang="scss">
.news-details {
    padding: 2rem;

    .title {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 1rem;
    }

    .thumbnail {
        margin-bottom: 1rem;
        border: 1px #c1c1c1 solid;
        border-radius: 10px;

        img.lazy-image {
            width: 100%;
            max-height: 500px;
            object-fit: cover;
            background-size: cover;
            background-position: center;
            transition: opacity 0.3s ease-in-out;
            border-radius: 10px;
        }
    }

    .description {
        font-size: 1.1rem;
        line-height: 1.7;
        margin-bottom: 1.5rem;
    }

    .tags {
        margin-top: 1rem;

        .tag {
            display: inline-block;
            margin-right: 0.5rem;
            background: #eef0f2;
            padding: 0.3rem 0.6rem;
            font-size: 0.85rem;
            border-radius: 3px;
            color: #333;
        }
    }

    .loading,
    .error {
        text-align: center;
        color: #666;
        padding: 2rem 0;
    }

    .error {
        color: red;
    }
    .text-muted {
        line-height: 1px;
        color: #666;
        letter-spacing: 1px;
        margin-bottom: 20px;
    }
}
</style>
