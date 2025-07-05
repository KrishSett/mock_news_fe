import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import PageView from '../views/PageView.vue';
import NewsDetails from '../views/NewsDetails.vue';
import NewsList from '../views/NewsList.vue';
import NotFound from '../views/NotFound.vue';
import { useNavStore } from '../states/nav.states';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Home',
      breadcrumb: 'Home'
    }
  },
  {
    path: '/page/:slug',
    name: 'page',
    component: PageView,
    meta: {
      title: 'Page',
      breadcrumb: 'Home / Page'
    }
  },
  {
    path: '/news/:uuid',
    name: 'news.details',
    component: NewsDetails,
    meta: {
      title: 'News Details',
      breadcrumb: 'Home / News'
    }
  },
  {
    path: '/news/category/:slug',
    name: 'news.category',
    component: NewsList,
    meta: {
      title: 'News Category',
      breadcrumb: 'Home / Category'
    }
  },
  {
    path: '/news/tag/:slug',
    name: 'news.tag',
    component: NewsList,
    meta: {
      title: 'News Tag',
      breadcrumb: 'Home / Tag'
    }
  },
  {
    path: '/:catchAll(.*)',
    name: 'not-found',
    component: NotFound,
    meta: {
      title: '404 - Page Not Found'
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Set page title
router.beforeEach((to, from, next) => {
  document.title = `${process.env.VUE_APP_TITLE} - ${to.meta.title || ''}`;
  next();
});

// Set page breadcrumb
router.afterEach((to) => {
  const navigation = useNavStore();
  navigation.setBreadcrumbs(to);
});

export default router;
