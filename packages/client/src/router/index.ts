import { createRouter, createWebHistory } from 'vue-router'
import { hasChallsReadPermission } from '../util/permissions'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: async () => import('../views/HomeView.vue') },
    { path: '/login', component: async () => import('../views/LoginView.vue') },
    {
      path: '/register',
      component: async () => import('../views/RegisterView.vue'),
    },
    {
      path: '/recover',
      component: async () => import('../views/RecoverView.vue'),
    },
    {
      path: '/verify',
      component: async () => import('../views/VerifyView.vue'),
    },
    {
      path: '/profile',
      component: async () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile/:uuid',
      component: async () => import('../views/ProfileView.vue'),
    },
    {
      path: '/challs',
      component: async () => import('../views/ChallsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/scores',
      component: async () => import('../views/ScoreboardView.vue'),
    },
    {
      path: '/admin/challs',
      component: async () => import('../views/admin/ChallsView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/integrations/ctftime/callback',
      component: async () => import('../views/CtftimeCallbackView.vue'),
    },
    { path: '/scoreboard', redirect: '/scores' },
    {
      path: '/:pathMatch(.*)*',
      component: async () => import('../views/ErrorView.vue'),
      props: { error: '404' },
    },
  ],
})

const loggedOutOnlyPaths = ['/login', '/register', '/recover']

router.beforeEach(to => {
  const loggedIn = !!localStorage.getItem('token')

  if (loggedIn && loggedOutOnlyPaths.includes(to.path)) {
    return '/profile'
  }

  if (!loggedIn && to.meta.requiresAuth) {
    return '/'
  }

  if (to.meta.requiresAdmin && !hasChallsReadPermission()) {
    return '/'
  }
})

export { router }
