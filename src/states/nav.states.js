import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { STATE_KEYS } from '../utils/state.keys';
import { AUTH_KEYS } from '../utils/auth.keys';

const EXPIRY_DURATION_MS = 60 * 60 * 1000; // 1 hour
const BREADCRUMB_LIMIT = 1;

export const useNavStore = defineStore(STATE_KEYS.NAV, () => {
    // State
    const navItems = ref([]);
    const breadcrumbs = ref([]);
    const navFetchedAt = ref(null);

    // Getters
    const getNavItems = computed(() => navItems.value);
    const getBreadcrumbs = computed(() => breadcrumbs.value);
    const isNavExpired = computed(() => {
        if (!navFetchedAt.value) return true;
        return Date.now() - new Date(navFetchedAt.value).getTime() > EXPIRY_DURATION_MS;
    });

    // Actions
    function setNavItems(items) {
        navItems.value = items;
        navFetchedAt.value = new Date().toISOString();
    }

    function setBreadcrumbs(route) {
        const exists = breadcrumbs.value.find(b => b.fullPath === route.fullPath);
        if (!exists) {
            breadcrumbs.value.push({
                name: route.name,
                path: route.path,
                fullPath: route.fullPath,
                meta: route.meta,
                params: route.params
            });

            // Trim to the last 10 entries
            if (breadcrumbs.value.length > BREADCRUMB_LIMIT) {
                breadcrumbs.value.splice(0, breadcrumbs.value.length - BREADCRUMB_LIMIT);
            }
        }
    }

    function goBack() {
        if (breadcrumbs.value.length > 1) {
            breadcrumbs.value.pop();
            return breadcrumbs.value[breadcrumbs.value.length - 1];
        }
        return null;
    }

    function clearNav() {
        navItems.value = [];
        navFetchedAt.value = null;
        breadcrumbs.value = [];
    }

    return {
        // State
        navItems,
        breadcrumbs,
        navFetchedAt,

        // Getters
        getNavItems,
        getBreadcrumbs,
        isNavExpired,

        // Actions
        setNavItems,
        setBreadcrumbs,
        goBack,
        clearNav
    };
}, {
    persist: {
        key: AUTH_KEYS.nav || 'pinia-nav',
        storage: sessionStorage,
        paths: ['navItems', 'navFetchedAt']
    }
});
