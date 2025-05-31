import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { STATE_KEYS } from '../utils/state.keys';

export const useAuthStore = defineStore(STATE_KEYS.AUTH, () => {
  // State (direct properties - no dynamic keys)
  const authorization = ref(null);
  const authType = ref(null);
  const visitorId = ref(null);
  const isAuthenticated = ref(false);

  // Getters
  const getAuthorization = computed(() => authorization.value);
  const getAuthType = computed(() => authType.value);
  const getVisitorId = computed(() => visitorId.value);
  const getIsAuthenticated = computed(() => isAuthenticated.value);
  const getAuth = computed(function () {
    return {
      "authorization": authorization.value,
      "authType": authType.value,
      "visitorId": visitorId.value,
      "isAuthenticated": isAuthenticated.value
    }
  })

  // Actions
  function setAuth(data) {
    authorization.value = data?.authorization ?? null;
    authType.value = data?.authType ?? null;
    visitorId.value = data?.visitorId ?? null;
    isAuthenticated.value = true;
  }

  function clearAuth() {
    authorization.value = null;
    authType.value = null;
    visitorId.value = null;
    isAuthenticated.value = false;
  }

  return {
    // State
    authorization,
    authType,
    visitorId,
    isAuthenticated,
    
    // Getters
    getAuthorization,
    getAuthType,
    getVisitorId,
    getIsAuthenticated,
    getAuth,
    
    // Actions
    setAuth,
    clearAuth
  };
});