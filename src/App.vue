<template>
  <AppHeader/>
  <AppNavbar />
  

  <AppFooter />
</template>

<script>
import AppHeader from '@/components/AppHeader.vue';
import AppNavbar from '@/components/AppNavbar.vue';
import AppFooter from '@/components/AppFooter.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppNavbar,
    AppFooter
  }
}
</script>

<style  lang="scss">
@import '@/assets/scss/styles.scss';
</style>
