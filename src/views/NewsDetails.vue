<template>
    <section class="news-details">
        <!-- Error Message -->
        <div v-if="errorMessage">
            <ErrorMessage :error="errorMessage || 'Something went wrong while loading the news.'"></ErrorMessage>
        </div>

        <!-- Main News Details -->
        <div  v-else>
            <div class="container" v-if="isLoaded">
                <BreadCrumb />

                    <!-- Title and Meta -->
                    <h1 class="title">{{ news.title }}</h1>
                    <p class="news-subtitle">{{ news.short_description }}</p>
                    <p class="text-muted">{{ news.created_at }}</p>

                    <!-- Thumbnail -->
                    <div class="thumbnail" v-if="news.thumbnail?.src">
                        <img :src="imgSrc" :alt="news.thumbnail.alt || 'News image'"
                            :style="{ backgroundImage: `url('${news.thumbnail.placeholder_image}')` }" class="lazy-image" />
                    </div>

                    <!-- Description -->
                    <div class="description" v-if="news.description" v-html="news.description"></div>
                    <div class="description" v-else>No description available.</div>

                    <!-- Tags -->
                    <div class="tags" v-if="news.tags?.length">
                        <span class="tag" v-for="tag in news.tags" :key="tag.id">
                            <RouterLink :to="`/news/tag/${tag.slug}`">#{{ tag.slug }}</RouterLink>
                        </span>
                    </div>

                    <!-- Related News -->
                    <div v-if="news.related_news?.length" class="related-news">
                        <h2 class="section-title">Related News</h2>
                        <div class="related-news-grid">
                            <article class="news-card" v-for="(article, index) in news.related_news" :key="article.uuid">
                                <NewsCard :article="article" :index="index" />
                            </article>
                        </div>
                    </div>
            </div>
            <!-- Loading -->
            <div v-else class="loading">Loading...</div>
        </div>
    </section>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { newsService } from '../common/news.service';
import { useAuthStore } from '../states/auth.states';
import NewsCard from '../components/NewsCard.vue';
import BreadCrumb from '../components/BreadCrumb.vue';
import ErrorMessage from '../components/ErrorMessage.vue';

const route = useRoute();
const uuid = route.params.uuid;
const authStore = useAuthStore();
const auth = authStore.getAuthState;
const authorization = authStore.authorization;

const news = ref({});
const isLoaded = ref(false);
const errorMessage = ref(null);
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
        console.error('Error loading news details:', error.message);
        news.value = {};
        errorMessage.value = error.message;
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

    .news-subtitle {
        font-size: 1.2rem;
        font-weight: 400;
        margin-bottom: 1rem;
        color: #666;
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

    .text-muted {
        line-height: 1.2;
        color: #666;
        letter-spacing: 0.5px;
        margin-bottom: 20px;
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
            transition: box-shadow 0.2s ease;
        }

        .tag:hover {
            box-shadow: 2px 2px 2px #e1e1e1;
        }

        a {
            color: #333 !important;
            text-decoration: none;
        }
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

    .loading {
        text-align: center;
        color: #666;
        padding: 2rem 0;
    }
}
</style>
