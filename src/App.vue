<script setup lang="ts">
import { onMounted } from 'vue'
import ru from 'element-plus/es/locale/lang/ru'

import { useAuthStore } from './stores/auth'

import SearchBar from '@/components/SearchBar.vue'
import UserBar from '@/components/UserBar.vue'

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.checkAuth()
})
</script>

<template>
  <el-config-provider :locale="ru">
    <div class="flex items-center justify-between p-2 font-bold bg-gray-600">
      <el-link href="/">Metal-Archives.ru</el-link>
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
