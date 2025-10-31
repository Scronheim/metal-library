import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Main page',
    component: () => import('@/pages/MainPage.vue')
  },
  {
    path: '/groups/add',
    name: 'Groups add page',
    component: () => import('@/pages/GroupAddPage.vue')
  },
  {
    path: '/groups/:id',
    name: 'Groups page',
    component: () => import('@/pages/GroupPage.vue')
  },
  {
    path: '/albums/:id',
    children: [
      {
        name: 'Albums page',
        path: '',
        component: () => import('@/pages/AlbumPage.vue')
      },
      {
        name: 'albumReviews',
        path: 'reviews',
        component: () => import('@/pages/albums/AlbumReviewsPage.vue')
      }
    ]
  },
  {
    path: '/news',
    children: [
      {
        name: 'News page',
        path: '',
        component: () => import('@/pages/news/NewsPage.vue')
      },
      {
        name: 'addNewsPage',
        path: 'add',
        component: () => import('@/pages/news/NewsAddPage.vue')
      }
    ]
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/pages/auth/AuthPage.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/auth/success',
    name: 'AuthSuccess',
    component: () => import('@/pages/auth/AuthSuccess.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/auth/error',
    name: 'AuthError',
    component: () => import('@/pages/auth/AuthError.vue'),
    meta: { guestOnly: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.userIsAuth) {
    next('/auth')
  } else if (to.meta.guestOnly && authStore.userIsAuth) {
    next('/')
  } else {
    next()
  }
})

export default router
