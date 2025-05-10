<template>
  <nav class="navbar">
    <ul class="navbar__list list-horizontal">
      <li v-for="(item, index) in navItems" :key="index">
        {{ item }}
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ApiService, {
  getUserIdFromStorage,
  getAuthTypeFromStorage,
} from "../common/api.service";

const props = defineProps({
  authToken: {
    type: String,
    required: true,
  },
});

const emits = defineEmits(["nav-completed"]);

const navItems = ref([]);

const fetchNavItems = async () => {
  try {
    const authorization = props.authToken;
    const apiService = new ApiService({
      authorization: `Bearer ${authorization}`,
      "X-AUTH-TYPE": getAuthTypeFromStorage(),
      "X-USER-ID": getUserIdFromStorage(),
    });

    const response = await apiService.get("feed/categories");
    navItems.value = response;
  } catch (error) {
    console.error("Failed to fetch navigation items:", error);
  } finally {
    console.log("DONE RESPONSE");
    emits("nav-completed", true);
  }
};

onMounted(fetchNavItems);
</script>
