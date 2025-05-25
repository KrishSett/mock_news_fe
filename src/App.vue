<template>
  <AppHeader />
  <AppNavbar v-if="authComplete" />
  <AppFooter />
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
import useAuthStore from "./states/auth.states";
import "vue-loading-overlay/dist/css/index.css";
// Authentication logic
const {  isLoading, authorization, authType, visitorId, authenticate } = useAuth();

// State load
const authStore = useAuthStore();
const authComplete = ref(false);

// Lifecycle
onMounted(async () => {
  try {
    await authenticate();
    console.log("Authenticated:", authorization, authType); // true
    authStore.setAuth({
      authorization: authorization,
      authType: authType,
      visitorId: visitorId
    });

    authComplete.value = true
  } catch (error) {
    console.log("Not authenticated", error); // false
  }
});
</script>

<style lang="scss">
@import "@/assets/scss/styles.scss";
</style>
