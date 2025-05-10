<template>
  <AppHeader :auth-token="authToken"></AppHeader>
  <AppNavbar v-show="isAuthenticated"></AppNavbar>
  <AppFooter></AppFooter>
  <Loading v-model:active="isLoading"></Loading>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AppHeader from "@/components/AppHeader.vue";
import AppNavbar from "@/components/AppNavbar.vue";
import AppFooter from "@/components/AppFooter.vue";
import AuthService from "./common/auth.service";
import { useLoading } from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";

// Reactive state
const authToken = ref(null);
const isAuthenticated = ref(false);

// Loader
const $loading = useLoading();

// Initialize auth service
const authService = new AuthService();
onMounted(async () => {
  const loader = $loading.show({
    fullPage: true,
    loader: "dots",
    backgroundColor: "#ffffff",
    opacity: 0.8,
  });

  try {
    const authResult = await authService.authenticate();

    if (authResult) {
      const encToken = window.localStorage.getItem("X-AUTH-TOKEN");
      if (encToken) {
        authToken.value = authService.decryptAuthToken(encToken);
        isAuthenticated.value = true;
      }
    }
  } catch (error) {
    console.error("[Auth] Failed:", error);
  } finally {
    loader.hide();
  }
});
</script>

<style lang="scss">
@import "@/assets/scss/styles.scss";
</style>
