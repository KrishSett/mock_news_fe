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
                    <RouterLink :to="`/news/tag/${tag.slug}`">#{{ tag.slug }}</RouterLink>
                </span>
            </div>

            <!-- Related News Section -->
            <div v-if="news.related_news?.length" class="related-news">
                <h2 class="section-title">Related News</h2>
                <div class="related-news-grid">
                    <article class="news-card" v-for="(article, index) in news.related_news" :key="article.uuid">
                        <NewsCard :article="article" :index="index"></NewsCard>
                    </article>
                </div>
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
import NewsCard from '../components/NewsCard.vue';

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
        margin-top: 3rem;
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
        }
        .tag:hover {
            box-shadow: 2px 2px 2px #e1e1e1;
        }
        a {
            color: #333 !important;
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
        line-height: 1.2;
        color: #666;
        letter-spacing: 0.5px;
        margin-bottom: 20px;
    }

    .related-news {
        margin-top: 3rem;
        text-transform: uppercase;

        .section-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            color: #2c3e50;
            position: relative;
            display: inline-block;
            padding-bottom: 0.5rem;

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

        .related-news-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 1.5rem;

            article.news-card {
                flex: 1 1 calc(25% - 1.5rem);
                max-width: calc(25% - 1.5rem);
                box-sizing: border-box;

                @media (max-width: 1024px) {
                    flex: 1 1 calc(50% - 1rem);
                    max-width: calc(50% - 1rem);
                }

                @media (max-width: 640px) {
                    flex: 1 1 100%;
                    max-width: 100%;
                }
            }
        }
    }
}
</style>
