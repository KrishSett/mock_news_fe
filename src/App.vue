<template>
  <AppHeader />
  <AppNavbar v-if="isAuthenticated" />
  <AppFooter />
  <Loading v-model:active="isLoading" />
</template>

<script setup>
import { ref, onMounted, watch, provide } from "vue";
import AppHeader from "@/components/AppHeader.vue";
import AppNavbar from "@/components/AppNavbar.vue";
import AppFooter from "@/components/AppFooter.vue";
import { useAuth } from "./store/apiAuth.storage";
import "vue-loading-overlay/dist/css/index.css";

// Authentication logic
const { isAuthenticated, isLoading, authorization, authType, visitorId, authenticate } = useAuth();
// Lifecycle
  onMounted(async () => {
    try {
      await authenticate();
      console.log("Authenticated:", isAuthenticated.value); // true
    } catch {
      console.log("Not authenticated"); // false
    }
  });

  provide("authorization", authorization);
  provide("authType", authType);
  provide("visitorId", visitorId);
</script>

<style lang="scss">
@import "@/assets/scss/styles.scss";
</style>
