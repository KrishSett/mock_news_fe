<template>
  <AppHeader />
  <AppNavbar v-if="authComplete" />

  <!-- Dynamic routes will render here -->
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>

  <AppFooter v-if="authComplete" />

  <Teleport to="#page_loader">
    <Loading v-model:active="isLoading" />
  </Teleport>
</template>

<script setup>
import { onMounted, ref } from "vue";
import AppHeader from "@/components/AppHeader.vue";
import AppNavbar from "@/components/AppNavbar.vue";
import AppFooter from "@/components/AppFooter.vue";
import { useAuth } from "./store/apiAuth.storage";
import { useAuthStore } from "./states/auth.states";
import "vue-loading-overlay/dist/css/index.css";
// Authentication logic
const { isLoading, authenticate } = useAuth();

// State load
const authStore = useAuthStore();
const authComplete = ref(false);

// Lifecycle
onMounted(async () => {
  try {
    await authenticate();

    authStore.setAuthenticated();
    authComplete.value = true;
  } catch (error) {
    authStore.clearAuth();
    console.log("Not authenticated", error);
  }
});
</script>

<style lang="scss">
@import "@/assets/scss/styles.scss";
</style>
