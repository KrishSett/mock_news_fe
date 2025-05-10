<template>
  <header class="header">
    <div class="header__container">
      <h1 class="header__title">
        <img src="@/assets/news_portal_logo.svg" alt="news-portal" />
        <p class="header__title__date">{{ todaysDate }}</p>
      </h1>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";

const todaysDate = computed(() => new Date().toDateString());
</script>
