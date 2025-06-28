<template>
  <nav class="navbar" v-show="isLoaded">
    <ul class="navbar__list list-horizontal">
      <li v-for="(item, key) in navItems" :key="key" class="navbar__item"
        :class="{ 'has-dropdown': item.subcategories && item.subcategories.length }">
        <a :href="item.href || '#'" class="navbar__link">
          {{ item.title }}
          <span v-if="item.subcategories && item.subcategories.length" class="dropdown-indicator"></span>
        </a>
        <ul v-if="item.subcategories && item.subcategories.length" class="navbar__dropdown">
          <li v-for="(subitem, subkey) in item.subcategories" :key="subkey" class="navbar__dropdown-item">
            <a :href="subitem.href" class="navbar__dropdown-link">
              {{ subitem.title }}
            </a>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { useAuthStore } from "../states/auth.states";
import { contentService } from "../common/content.service";

const navItems = ref([]);
const isLoaded = ref(false);


const authStore = useAuthStore();
const auth = authStore.getAuthState;
const authorization = authStore.authorization;


// Load Navbar items
async function fetchNavbarItems() {
  if (!auth.isAuthenticated) {
    throw new Error("Authentication not complete");
  }

  return await contentService.getNavbarItems({
    "Authorization": `Bearer ${authorization}`,
    "X-AUTH-TYPE": auth.authType,
    "X-USER-ID": auth.visitorId
  });
}

// Lifecycle
onBeforeMount(async () => {
  try {
    const response = await fetchNavbarItems();
    navItems.value = response;
  } catch (error) {
    console.log("Error", error);
    navItems.value = [];
  } finally {
    isLoaded.value = true;
  }
});
</script>
