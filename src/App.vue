<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowDown } from '@element-plus/icons-vue'
import ru from 'element-plus/es/locale/lang/ru'

import { useStore } from './stores/store'
import { useAuthStore } from './stores/auth'

import SearchBar from '@/components/SearchBar.vue'
import UserBar from '@/components/UserBar.vue'

const router = useRouter()

const store = useStore()
const authStore = useAuthStore()

const handleCommand = (command: string) => {
  switch (command) {
    case 'group':
      router.push('/group/add')
      break
    case 'news':
      router.push('/news/add')
      break
    default:
      break
  }
}

onMounted(async () => {
  await authStore.checkAuth()
})
</script>

<template>
  <el-config-provider :locale="ru">
    <div class="flex items-center justify-between p-2 font-bold bg-black-100">
      <div class="flex items-center gap-2">
        <RouterLink to="/">
          <el-image style="width: 30px; height: 30px" src="/logo.png" />
        </RouterLink>
        <el-dropdown v-if="authStore.userIsAdmin" @command="handleCommand">
          <el-button type="info">
            Добавить
            <el-icon><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="group">Группу</el-dropdown-item>
              <el-dropdown-item command="news">Новость</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button type="info" @click="store.getRandomGroup">Случайная группа</el-button>
        <el-button tag="router-link" to="/release_calendar" type="info">Календарь релизов</el-button>
      </div>
      <div class="flex gap-2">
        <SearchBar />
        <UserBar />
      </div>
    </div>
    <el-container>
      <el-main style="padding: 0">
        <RouterView />
      </el-main>
    </el-container>
  </el-config-provider>
</template>

<style scoped></style>
