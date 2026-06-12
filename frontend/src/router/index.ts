import { createRouter, createWebHistory } from 'vue-router';
import BoardPage from '@/pages/BoardPage.vue';
import CompaniesPage from '@/pages/CompaniesPage.vue';
import PositionDetailPage from '@/pages/PositionDetailPage.vue';
import StatsPage from '@/pages/StatsPage.vue';
import TimelinePage from '@/pages/TimelinePage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/board'
    },
    {
      path: '/board',
      name: 'board',
      component: BoardPage
    },
    {
      path: '/timeline',
      name: 'timeline',
      component: TimelinePage
    },
    {
      path: '/positions/:id',
      name: 'position-detail',
      component: PositionDetailPage,
      props: true
    },
    {
      path: '/stats',
      name: 'stats',
      component: StatsPage
    },
    {
      path: '/companies',
      name: 'companies',
      component: CompaniesPage
    }
  ]
});

export default router;
