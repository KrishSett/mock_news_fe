<template>
	<AppHeader :auth-token="authToken"></AppHeader>
	<AppNavbar v-if="isAuthenticated"></AppNavbar>
	<AppFooter></AppFooter>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AppHeader from "@/components/AppHeader.vue";
import AppNavbar from "@/components/AppNavbar.vue";
import AppFooter from "@/components/AppFooter.vue";
import AuthService from "./common/auth.service";

// Reactive state
const authToken = ref(null);
const isAuthenticated = ref(false);

// Initialize auth service
const authService = new AuthService();

onMounted(async () => {
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
	}
});
</script>

<style lang="scss">
@import "@/assets/scss/styles.scss";
</style>
