<template>
  <footer class="footer">
    <div class="footer__copyright">
      <span class="footer__subtitle">
        &copy; {{ currentYear }} - {{ footerTitle }}
      </span>
      <p>Your news portal description or tagline can go here</p>
    </div>
    
    <div class="footer__links-container">
      <ul class="footer__links">
        <!-- Row 1 -->
        <li><a href="#" class="footer__link">Home</a></li>
        <li><a href="#" class="footer__link">Latest News</a></li>
        <li><a href="#" class="footer__link">Categories</a></li>
        <li><a href="#" class="footer__link">Popular</a></li>
        
        <!-- Row 2 -->
        <li><a href="#" class="footer__link">About Us</a></li>
        <li><a href="#" class="footer__link">Contact</a></li>
        <li><a href="#" class="footer__link">Advertise</a></li>
        <li><a href="#" class="footer__link">Careers</a></li>
      </ul>
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue";

const footerTitle = `${process.env.VUE_APP_TITLE} ${process.env.VUE_APP_SUBTITLE}`;
const currentYear = computed(() => {
  return new Date().getFullYear();
});
</script>
