<!-- AppFooter.vue -->
<template>
  <footer class="footer">
    <p class="footer__copyright">
      © {{ currentYear }} News Portal - Learning Project
    </p>
    <ul class="footer__links list-horizontal">
      <li><a href="#" class="footer__link">About</a></li>
      <li><a href="#" class="footer__link">Contact</a></li>
    </ul>
  </footer>
</template>

<script>
import { computed } from "vue";

export default {
  setup() {
    const currentYear = computed(() => {
      return new Date().getFullYear();
    });

    return {
      currentYear,
    };
  },
};
</script>
