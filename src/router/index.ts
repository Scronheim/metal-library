import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { useStore } from '@/stores/store'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Main page',
    component: () => import('@/pages/MainPage.vue'),
  },
  {
    path: '/quests',
    name: 'Quests page',
    component: () => import('@/pages/QuestsPage.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const store = useStore()

  await store.checkUserLoggedIn()
  next()
})

export default router
