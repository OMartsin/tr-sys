import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/clients',
      name: 'Clients',
      component: () => import('../views/ClientView.vue')
    },
    {
      path: '/drivers',
      name: 'Drivers',
      component: () => import('../views/ClientView.vue')
    },
    {
      path: '/routes',
      name: 'Routes',
      component: () => import('../views/ClientView.vue')
    },
    {
      path: '/orders',
      name: 'Orders',
      component: () => import('../views/ClientView.vue')
    },
    {
      path: '/reports',
      name: 'Reports',
      component: () => import('../views/ClientView.vue')
    },
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('../views/ClientView.vue')
    }
  ]
})

export default router
