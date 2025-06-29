import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import PageView from '../views/PageView.vue';
import NewsDetails from '../views/NewsDetails.vue';

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
  {
      path: '/page/:slug',
      name: 'page',
      component: PageView
  },
  {
    path: '/news/:uuid',
    name: 'news.details',
    component: NewsDetails
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

