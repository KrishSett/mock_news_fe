<!-- AppFooter.vue -->
<template>
  <footer class="footer">
    <p class="footer__copyright">
      <span class="footer__subtitle">
        &copy; {{ currentYear }} - {{ footerTitle }}
      </span>
    </p>
    <ul class="footer__links list-horizontal">
      <li><a href="#" class="footer__link">About</a></li>
      <li><a href="#" class="footer__link">Contact</a></li>
    </ul>
  </footer>
</template>

<script setup>
import { computed } from "vue";

const footerTitle = `${process.env.VUE_APP_TITLE} ${process.env.VUE_APP_SUBTITLE}`;
const currentYear = computed(() => {
  return new Date().getFullYear();
});
</script>
