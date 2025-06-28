import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { STATE_KEYS } from '../utils/state.keys';
import { AUTH_KEYS } from '../utils/auth.keys';

const EXPIRY_DURATION_MS = 60 * 60 * 1000; // 1 hour

export const useFooterStore = defineStore(STATE_KEYS.FOOTER, () => {
    // State
    const footerPages = ref([]);
    const footerFetchedAt = ref(null);

    // Getters
    const getFooterPages = computed(() => footerPages.value);
    const isFooterExpired = computed(() => {
        if (!footerFetchedAt.value) return true;
        return Date.now() - new Date(footerFetchedAt.value).getTime() > EXPIRY_DURATION_MS;
    });

    // Actions
    function setFooterPages(pages) {
        footerPages.value = pages;
        footerFetchedAt.value = new Date().toISOString();
    }

    function clearFooter() {
        footerPages.value = [];
        footerFetchedAt.value = null;
    }

    return {
        // State
        footerPages,
        footerFetchedAt,

        // Getters
        getFooterPages,
        isFooterExpired,

        // Actions
        setFooterPages,
        clearFooter
    };
}, {
    persist: {
        key: AUTH_KEYS.footer || 'pinia-footer',
        storage: sessionStorage,
        paths: ['footerPages', 'footerFetchedAt']
    }
});
