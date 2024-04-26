import { createRouter, createWebHistory } from 'vue-router'
import { serverUrl } from '../const';
import { ref } from 'vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/DashboardView.vue')
    },
    {
      path: '/clients',
      name: 'Clients',
      component: () => import('../views/ClientView.vue')
    },
    {
      path: '/drivers',
      name: 'Drivers',
      component: () => import('../views/DriverView.vue')
    },
    {
      path: '/trucks',
      name: 'Trucks',
      component: () => import('../views/TruckView.vue')
    },
    {
      path: '/trailers',
      name: 'Trailers',
      component: () => import('../views/TrailerView.vue')
    },
    {
      path: '/orders',
      name: 'Orders',
      component: () => import('../views/OrderView.vue')
    },
    {
      path: '/reports',
      name: 'Reports',
      component: () => import('../views/FinanceOperationsView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFoundView.vue')
    }, 
    {
      path: '/client/:id',
      name: 'ClientDetails',
      component: () => import('../views/ClientDetailsView.vue')
    },
    {
      path: '/order/:id',
      name: 'OrderDetails',
      component: () => import('../views/OrderDetailsView.vue')
    },
    {
      path: '/driver/:id',
      name: 'DriverDetails',
      component: () => import('../views/DriverDetailsView.vue')
    },
    {
      path: '/truck/:id',
      name: 'TruckDetails',
      component: () => import('../views/TruckDetailsView.vue')
    },
    {
      path: '/trailer/:id',
      name: 'TrailerDetails',
      component: () => import('../views/TrailerDetailView.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/error',
      name: 'Error',
      component: () => import('../views/ErrorView.vue')
    }
  ]
})

export const hasLoaded = ref(false);
router.beforeResolve((to, from, next) => {
  checkServerAvailability().then((result) => {
    console.log(result);
    if (result || to.name === 'Error' || to.name === 'Login') {
      next();
    } else {
      next({ name: 'Error' });
      return false;
    }
  });
});

router.beforeResolve((to, from, next) => {
  if (to.name === 'Login') {
    next();
  } else {
    checkAuth().then((auth) => {
      if (auth) {
        next();
      } else {
        next({ name: 'Login' });
      }
    });
  }
});

async function checkAuth() {
  if (localStorage.getItem('token')) {
    try {
      // Attempt to fetch the user role from the server
      const response = await fetch(`${serverUrl}/login/get-role`, {
        method: 'GET',
        headers: {
          'Authorization': `${localStorage.getItem('token')}`
        }
      });

      if (response.status === 200) {
        const data = await response.json();
        if (data.role === 'ADMIN') {
          console.log('Admin');
          return true;
        } else {
          console.log('Not admin');
          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error fetching role:', error);
      return false;
    }
  } else {
    return false;
  }
}

async function checkServerAvailability() {
  try {
    const response = await fetch(`${serverUrl}/ping`, {
      method: 'GET'
    });

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error fetching role:', error);
    return false;
  }
}

router.beforeResolve((to, from, next) => {
  if (to.name) {
    hasLoaded.value = true;
  }
  next()
})

router.afterEach((to, from) => {
  hasLoaded.value = false;
})


export default router
