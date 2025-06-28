<template>
  <footer class="footer" v-show="isLoaded">
    <div class="footer__copyright">
      <span class="footer__subtitle">
        &copy; {{ footerTitle }}
      </span>
      <p>Your news portal description or tagline can go here</p>
    </div>

    <div class="footer__links-container">
      <!-- Loop through each row of links -->
      <ul 
        class="footer__links"
        v-for="(linkGroup, groupIndex) in footerItems"
        :key="`link-group-${groupIndex}`"
      >
        <!-- Loop through each link in the row -->
        <li v-for="link in linkGroup" :key="link.slug">
          <a :href="link.url" class="footer__link">
            {{ link.title }}
          </a>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed, onBeforeMount } from "vue";
import { useAuthStore } from "../states/auth.states";
import { contentService } from "../common/content.service";

const footerItems = ref([]);
const isLoaded = ref(false);
const footerTitle = computed(() => {
  return `${new Date().getFullYear()} - ${process.env.VUE_APP_TITLE} ${process.env.VUE_APP_SUBTITLE}`;
});

const authStore = useAuthStore();
const auth = authStore.getAuthState;
const authorization = authStore.authorization;

// Load Navbar items
async function fetchFooterItems() {
  if (!auth.isAuthenticated) {
    throw new Error("Authentication not completed");
  }

  return await contentService.getFooterPages({
    "Authorization": `Bearer ${authorization}`,
    "X-AUTH-TYPE": auth.authType,
    "X-USER-ID": auth.visitorId
  });
}

// Lifecycle
onBeforeMount(async () => {
  try {
    const response = await fetchFooterItems();
    footerItems.value = response;
  } catch (error) {
    console.log("Error", error);
    footerItems.value = [];
  } finally {
    isLoaded.value = true;
  }
});
</script>
