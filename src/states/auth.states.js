import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { STATE_KEYS } from '../utils/state.keys';
import { AUTH_KEYS } from '../utils/auth.keys';

export const useAuthStore = defineStore(STATE_KEYS.AUTH, () => {
  // State
  const authToken = ref(null);
  const authTime = ref(null);
  const visitorId = ref(null);
  const authType = ref(null);
  const isAuthenticated = ref(false);

  // Getters
  const getAuthState = computed(() => ({
    authToken: authToken.value,
    authTime: authTime.value,
    visitorId: visitorId.value,
    authType: authType.value,
    isAuthenticated: isAuthenticated.value
  }));

  const authorization = computed(() => {
    if (!authToken.value) return null;
    try {
      const decoded = atob(authToken.value);
      const jsonData = JSON.parse(decoded);
      return jsonData.token;
    } catch (e) {
      console.error('Failed to decode token:', e);
      return null;
    }
  });

  // Actions
  function setAuthToken(token, timestamp) {
    authToken.value = token;
    authTime.value = timestamp;
  }

  function setAuthenticated() {
    isAuthenticated.value = true;
    console.log("AUTH SET");
  }

  function setVisitorId(id) {
    visitorId.value = id;
  }

  function setAuthType(authTypeValue) {
    authType.value = authTypeValue;
  }

  function clearAuth() {
    authToken.value = null;
    authTime.value = null;
    visitorId.value = null;
    authType.value = null;
    isAuthenticated.value = false;
  }

  return {
    // State
    authToken,
    authTime,
    visitorId,
    authType,
    isAuthenticated,

    // Getters
    getAuthState,
    authorization,

    // Actions
    setAuthToken,
    setAuthenticated,
    setVisitorId,
    setAuthType,
    clearAuth
  };
}, {
  persist: {
    key: AUTH_KEYS.auth || 'pinia-auth',
    storage: localStorage,
    paths: ['authToken', 'authTime', 'visitorId', 'authType', 'isAuthenticated']
  },
});