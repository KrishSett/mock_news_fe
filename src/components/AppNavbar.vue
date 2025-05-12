<template>
  <nav class="navbar">
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
import { ref, inject, watchEffect } from "vue";
import { contentService } from "../common/content.service";

const auth = {
  "authorization": inject("authorization"),
  "authType": inject("authType"),
  "visitorId": inject("visitorId")
};

const navItems = ref([]);
const isLoaded = ref(false);
const error = ref(null);

const loadNavItems = async () => {
  try {
    error.value = null;
    isLoaded.value = false;
    
    if (!auth.authorization?.value || !auth.authType?.value || !auth.visitorId?.value) {
      navItems.value = [];
      return;
    }

    const response = await contentService.getNavbarItems({
      "Authorization": `Bearer ${auth.authorization.value}`,
      "X-AUTH-TYPE": auth.authType.value,
      "X-USER-ID": auth.visitorId.value
    });

    console.log("Nav items loaded:", response);
    navItems.value = response || [];
  } catch (err) {
    console.error("Failed to load nav items:", err);
    error.value = err;
    navItems.value = [];
  } finally {
    isLoaded.value = true;
  }
};

// React to auth changes
watchEffect(() => {
  if (auth.authorization?.value && auth.authType?.value && auth.visitorId?.value) {
    loadNavItems();
  }
});
</script>
