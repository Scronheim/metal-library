import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { useStore } from '@/stores/store'

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
    name: 'Albums page',
    component: () => import('@/pages/AlbumPage.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const store = useStore()

  await store.checkUserLoggedIn()
  next()
})

export default router
