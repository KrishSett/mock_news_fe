<template>
  <div class="np-wrapper">
    <AppHeader />

    <div v-if="authComplete">
      <AppNavbar />
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
      <AppFooter />
    </div>

    <div v-else class="full-screen-loader" :style="{'text-align' : 'center'}">Loading...</div>
  </div>
</template>


<script setup>
import { onBeforeMount, ref } from "vue";
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
onBeforeMount(async () => {
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
