<template>
  <AppHeader />
  <AppNavbar
    v-if="isAuthenticated && authToken"
    :auth-token="authToken"
    @nav-completed="handleLoader"
  />
  <AppFooter />
  <Loading v-model:active="isLoading" />
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import AppHeader from "@/components/AppHeader.vue";
import AppNavbar from "@/components/AppNavbar.vue";
import AppFooter from "@/components/AppFooter.vue";
import AuthService from "./common/auth.service";
import { useLoading } from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";

// State
const authToken = ref(null);
const isAuthenticated = ref(false);
const isLoading = ref(true);

// Loader
const $loading = useLoading();
const loader = $loading.show({ fullPage: true, loader: "dots" });

// Auth service
const authService = new AuthService();

// Authentication logic
const authenticate = async () => {
  try {
    const authResult = await authService.authenticate();
    if (!authResult) throw new Error("Authentication failed");

    const encToken = window.localStorage.getItem("X-AUTH-TOKEN");
    if (!encToken) throw new Error("No token found");

    authToken.value = authService.decryptAuthToken(encToken);
    isAuthenticated.value = true;
    await authService.getHashToken(authToken.value);

    return true;
  } catch (error) {
    console.error("Auth failed:", error);
    isAuthenticated.value = false;
    authToken.value = null;
    return false;
  }
};

const handleLoader = (data) => {
  console.log("NAV COMPLETE", data);
  loader.hide();
  isLoading.value = false;
};

// Lifecycle
onMounted(authenticate);

// Optional: Watch for token changes
watch(authToken, (newVal) => {
  if (newVal) {
    console.debug("Auth token updated");
  }
});
</script>
<style lang="scss">
@import "@/assets/scss/styles.scss";
</style>
