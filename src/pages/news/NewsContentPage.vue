<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { useStore } from '@/stores/store'

import NewsForm from '@/components/forms/NewsForm.vue'

import type { News } from '@/types'

const store = useStore()

// Refs
const news = ref<News>({ author: {}, content: '' })

onMounted(async () => {
  news.value = await store.getNewsById()
})
</script>

<template>
  <el-container class="news-main-content">
    <NewsForm :news="news" :max-length="10000000" :show-read-button="false" />
  </el-container>
</template>

<style lang="css" scoped>
.news-main-content {
  max-width: 1200px;
  margin: 10px auto;
  padding: 0 20px;
}
</style>
