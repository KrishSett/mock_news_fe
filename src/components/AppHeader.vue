<template>
  <header class="header">
    <div class="header__container">
      <h1 class="header__title">
        <img src="@/assets/news_portal_logo.svg" alt="news-portal" />
      </h1>
    </div>
  </header>
</template>

<script setup>
import { onUpdated } from "vue";

const props = defineProps({
  authToken: {
    type: String,
    required: true,
  },
});

onUpdated(() => {
  console.log("TOKEN (onUpdated):", props.authToken);
});
</script>
