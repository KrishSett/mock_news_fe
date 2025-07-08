<template>
    <router-link :to="`/news/${uuid}`" class="news-tile">
        <div class="image-container">
            <img :src="thumbnail.src" :alt="thumbnail.alt" class="news-image" loading="lazy" />
        </div>
        <div class="news-content">
            <h3 class="news-title">{{ title }}</h3>
            <p class="news-description">{{ shortDescription }}</p>
            <div class="news-meta">
                <span class="news-date">{{ formattedDate }}</span>
            </div>
        </div>
    </router-link>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    uuid: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true
    },
    thumbnail: {
        type: Object,
        required: true,
        validator: value => value.src && value.alt && value.placeholder_image
    },
    createdAt: {
        type: String,
        required: true
    }
})

const formattedDate = computed(() => {
    return new Date(props.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
})
</script>

<style lang="scss" scoped>
.news-tile {
    display: flex;
    max-height: 250px;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    text-decoration: none;
    color: inherit;

    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .image-container {
        width: 40%;
        max-width: 300px;
        min-width: 200px;
        height: 100%;
        max-height: 165px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f8f8f8;

        .news-image {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain; // ensures the image is centered without being cropped
            transition: opacity 0.3s ease;
            opacity: 1;
        }
    }


    .news-content {
        width: 60%;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .news-title {
            margin: 0 0 0.5rem;
            font-size: 1.2rem;
            line-height: 1.3;
            color: #333;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;

            &:hover {
                text-decoration: underline;
            }
        }

        .news-description {
            margin: 0 0 1rem;
            font-size: 1.05rem;
            color: #555;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .news-meta {
            font-size: 0.8rem;
            color: #999;
        }
    }
}
</style>
