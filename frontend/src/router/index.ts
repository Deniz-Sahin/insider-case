import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'templates',
      component: () => import('../views/TemplatesView.vue'),
    },
    {
      path: '/builder',
      name: 'builder',
      component: () => import('../views/BuilderView.vue'),
    },
    {
      path: '/builder/:id',
      name: 'builder-edit',
      component: () => import('../views/BuilderView.vue'),
    },
  ],
});

export default router;
