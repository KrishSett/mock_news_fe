<template>
    <div v-if="isLoaded">
        <div class="home-page">
            <div v-for="(articles, category) in apiData" :key="category">
                <section :class="`${category}-news`">
                    <div class="container">
                        <h2 class="section-title">{{ String(category).toUpperCase() }}</h2>
                        <div class="news-grid">
                            <article class="news-card" v-for="(article, index) in articles" :key="article.uuid">
                                <NewsCard :article="article" :index="index"></NewsCard>
                            </article>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import NewsCard from '../components/NewsCard.vue';
import { useAuthStore } from '../states/auth.states';
import { homeService } from '../common/home.service';

const apiData = ref({});
const isLoaded = ref(false);
const authStore = useAuthStore();
const auth = authStore.getAuthState;
const authorization = authStore.authorization;

const fetchNewsData = async () => {
    if (!auth.isAuthenticated) {
        throw new Error("Authentication not completed");
    }

    return await homeService.getHomePageContents({
        "Authorization": `Bearer ${authorization}`,
        "X-AUTH-TYPE": auth.authType,
        "X-USER-ID": auth.visitorId
    });
};

onMounted(async () => {
    try {
        const response = await fetchNewsData();
        apiData.value = response;
    } catch (error) {
        console.error('Error', error);
        apiData.value = {};
    } finally {
        isLoaded.value = true;
    }
});
</script>

<style lang="scss" scoped>
.home-page {
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
    }

    .section-title {
        font-size: 1.8rem;
        margin: 2rem 0 1.5rem;
        color: #333;
        position: relative;
        padding-bottom: 0.5rem;

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 60px;
            height: 3px;
            background: #e74c3c;
        }
    }

    .news-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
    }

    .category-news {
        margin-top: 3rem;
    }
}
</style>