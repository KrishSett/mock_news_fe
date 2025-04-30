<template>
  <nav class="navbar">
    <ul class="navbar__list list-horizontal">
      <li v-for="item in navItems" :key="item.text">
        <router-link
          :to="item.to"
          class="navbar__link"
          exact-active-class="router-link-active"
        >
          {{ item.text }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'AppNavbar',
  data() {
    return {
      navItems: [
        { text: 'Home', to: '/' },
        { text: 'Nation', to: '/nation' },
        { text: 'Technology', to: '/technology' },
        { text: 'System', to: '/system' },
        { text: 'Entertainment', to: '/entertainment' }
      ]
    }
  }
}
</script>