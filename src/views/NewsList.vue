<template>
    <div v-if="errorMessage">
        <ErrorMessage :error="errorMessage || 'An error occurred.'" />
    </div>
    <div v-else>
        <div class="container" v-if="isLoaded">
            <BreadCrumb />

            <div v-if="newses.length === 0" class="no-data">No news found.</div>

            <div class="news-tile-wrapper" v-for="(newsItem, index) in newses" :key="newsItem.id || index">
                <NewsTileComponent :uuid="newsItem.uuid" :title="newsItem.title"
                    :shortDescription="newsItem.short_description" :thumbnail="newsItem.thumbnail"
                    :createdAt="newsItem.created_at" />
            </div>

            <div class="pagination-container" v-if="pageLength > 1">
                <vue-awesome-paginate v-model="page" :total-items="totalItems" :items-per-page="itemsPerPage"
                    :max-pages-shown="5" :hide-prev-next-when-ends="true" @click="handlePageChange"
                    paginate-buttons-class="btn" active-page-class="btn-active" back-button-class="back-btn"
                    next-button-class="next-btn" />
            </div>
        </div>
        <div class="loading" v-else>Loading ...</div>
    </div>
</template>


<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { newsService } from '../common/news.service';
import { useAuthStore } from '../states/auth.states';
import NewsTileComponent from '../components/NewsTileComponent.vue';
import BreadCrumb from '../components/BreadCrumb.vue';
import ErrorMessage from '../components/ErrorMessage.vue';

const route = useRoute();
const uriSegments = route.path.split('/').filter(Boolean);
const type = uriSegments[1] ?? '';
const authStore = useAuthStore();
const auth = authStore.getAuthState;
const authorization = authStore.authorization;

const isLoaded = ref(false);
const errorMessage = ref(null);
const newses = ref({});
const page = ref(1);
const pageLength = ref(null);
const totalItems = ref(null);
const itemsPerPage = ref(null);

console.log("HELLO");

async function handlePageChange(newPage) {
    page.value = newPage;
    await fetchNewsList();
}

const fetchNewsList = async () => {
    if (!auth.isAuthenticated) {
        throw new Error("Authentication not completed");
    }

    let response = {};
    const headers = {
        "Authorization": `Bearer ${authorization}`,
        "X-AUTH-TYPE": auth.authType,
        "X-USER-ID": auth.visitorId
    };

    if (type == 'tag') {
        response = await newsService.getTagNewsList([uriSegments[2]], headers, page.value);
    } else if (type == 'category') {
        response = await newsService.getSubcategoryNewsList(uriSegments[2], headers, page.value);
    } else {
        throw new Error("Invalid type, not supported");
    }

    newses.value = response.data;
    pageLength.value = response.meta.last_page;
    totalItems.value = response.meta.total;
    itemsPerPage.value = response.meta.per_page;
}

onMounted(async () => {
    try {
        await fetchNewsList();
    } catch (error) {
        console.log('Error', error);
        newses.value = {};
        errorMessage.value = error.message;
    } finally {
        isLoaded.value = true;
    }
});
</script>

<style lang="scss" scoped>
.no-data {
    font-size: 1.2rem;
    color: #666;
    text-align: center;
}

.news-tile-wrapper {
    padding: 0.2rem;
    margin-bottom: 1.2rem;
}

.pagination-wrapper {
    display: flex;
    justify-content: flex-end; // Change to center if needed
    margin-top: 20px;
}

.pagination-container {
    margin-top: 1.2rem;
    display: flex;
    justify-content: right;
}

::v-deep(.btn) {
    align-items: center;
    height: 40px;
    width: 40px;
    margin-inline: 5px;
    cursor: pointer;
    border-radius: 20px;
    border: 1px solid #e1e1e1;
    background-color: #f2f2f2;
    color: #000;
    font-weight: 500;
    transition: background-color 0.3s ease;
    font-size: 1rem;
    padding: 0;

    &:hover {
        background-color: #dcdcdc;
    }
}

::v-deep(.btn-active) {
    background-color: #444;
    border-color: #444;
    color: #fff;

    &:hover {
        background-color: #222;
    }
}

::v-deep(.back-btn),
::v-deep(.next-btn) {
    font-size: 1rem;
}
</style>
