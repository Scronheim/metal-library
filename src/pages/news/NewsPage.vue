<script setup lang="ts">
import { onMounted } from 'vue'

import { useStore } from '@/stores/store'
import { useAuthStore } from '@/stores/auth'

import NewsForm from '@/components/forms/NewsForm.vue'

const store = useStore()
const authStore = useAuthStore()

onMounted(async () => {
  await store.getNews()
})
</script>

<template>
  <el-container class="news-main-content">
    <div v-if="authStore.userIsAdmin" class="flex justify-end">
      <router-link to="/news/add">Добавить новость</router-link>
    </div>
    <div class="grid grid-cols-3 gap-2">
      <NewsForm v-for="item in store.news" :key="item._id" :news="item" />
    </div>
  </el-container>
</template>

<style lang="css" scoped>
.news-main-content {
  max-width: 1200px;
  margin: 10px auto;
  padding: 0 20px;
  flex-direction: column;
}
</style>
