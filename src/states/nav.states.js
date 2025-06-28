import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { STATE_KEYS } from '../utils/state.keys';
import { AUTH_KEYS } from '../utils/auth.keys';

const EXPIRY_DURATION_MS = 60 * 60 * 1000; // 1 hour

export const useNavStore = defineStore(STATE_KEYS.NAV, () => {
    // State
    const navItems = ref([]);
    const breadcrumbs = ref([]);
    const previousRoute = ref(null);
    const currentPath = ref('/');
    const navFetchedAt = ref(null);

    // Getters
    const getNavItems = computed(() => navItems.value);
    const getBreadcrumbs = computed(() => breadcrumbs.value);
    const getPreviousRoute = computed(() => previousRoute.value);
    const getCurrentPath = computed(() => currentPath.value);
    const isNavExpired = computed(() => {
        if (!navFetchedAt.value) return true;
        return Date.now() - new Date(navFetchedAt.value).getTime() > EXPIRY_DURATION_MS;
    });

    // Actions
    function setNavItems(items) {
        navItems.value = items;
        navFetchedAt.value = new Date().toISOString();
    }

    function updateRouteState({ path, previous }) {
        if (path && path !== currentPath.value) {
            previousRoute.value = currentPath.value;
            currentPath.value = path;
        }
        if (previous) previousRoute.value = previous;
    }

    function setBreadcrumbs(bc) {
        breadcrumbs.value = bc;
    }

    function clearNav() {
        navItems.value = [];
        navFetchedAt.value = null;
    }

    return {
        // State
        navItems,
        breadcrumbs,
        previousRoute,
        currentPath,
        navFetchedAt,

        // Getters
        getNavItems,
        getBreadcrumbs,
        getPreviousRoute,
        getCurrentPath,
        isNavExpired,

        // Actions
        setNavItems,
        updateRouteState,
        setBreadcrumbs,
        clearNav
    };
}, {
    persist: {
        key: AUTH_KEYS.nav || 'pinia-nav',
        storage: sessionStorage,
        paths: ['navItems', 'navFetchedAt']
    }
});