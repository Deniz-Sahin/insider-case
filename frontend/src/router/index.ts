import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'templates',
      component: () => import('../views/TemplatesView'),
    },
    {
      path: '/builder',
      name: 'builder',
      component: () => import('../views/BuilderView'),
    },
    {
      path: '/builder/:id',
      name: 'builder-edit',
      component: () => import('../views/BuilderView'),
    },
  ],
});

export default router;
