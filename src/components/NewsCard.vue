<template>
    <a :href="`/news/${article.uuid}`">
        <div class="news-card-wrapper">
            <div class="news-card-wrapper__image">
                <img v-if="article.thumbnail" :src="newsImg" :alt="article.thumbnail.alt"
                    :data-src="article.thumbnail.src" class="news-card-wrapper__img" ref="news-thumbnail"/>
                <img v-else src="/img/default-img.png" alt="Default image"
                    class="news-card-wrapper__img news-card-wrapper__img--placeholder" />
            </div>
            <div class="news-card-wrapper__content">
                <h3 class="news-card-wrapper__title">{{ article.title }}</h3>
                <p class="news-card-wrapper__desc">{{ article.short_description }}</p>
            </div>
        </div>
    </a>
</template>

<script setup>
import { onMounted, useTemplateRef, ref, computed } from 'vue';
const props = defineProps({
    article: {
        type: Object,
        required: true,
        default: () => ({})
    },
    index: {
        type: Number,
        required: true,
        default: 0
    }
});

const newsThumbnail = useTemplateRef('news-thumbnail');
const newsImg = ref(props.article.thumbnail?.placeholder_image || '');

onMounted (() => {
    const realSrc = newsThumbnail.value.dataset?.src;
    if (!realSrc) {
        return;
    }

    newsImg.value = realSrc;
});
</script>

<style lang="scss" scoped>
.news-card-wrapper {
    border-radius: 10px;
    overflow: hidden;
    background-color: #fff;

    &__image {
        height: 180px;
        background-color: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: center;

        .news-card-wrapper__img {
            width: 100%;
            height: 100%;
            object-fit: cover;

            &--placeholder {
                object-fit: contain;
                background-color: #f0f0f0;
            }
        }
    }

    &__content {
        padding: 1rem;

        &>.news-card-wrapper__title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #2c3e50;
        }

        &>.news-card-wrapper__desc {
            margin-top: 5px;
            font-size: 0.95rem;
            line-height: 1.5;
            color: #555;
        }
    }
}
</style>
