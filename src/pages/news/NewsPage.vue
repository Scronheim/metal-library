<script setup lang="ts">
import { useStore } from '@/stores/store'

const store = useStore()
</script>

<template>
  <el-container class="news-main-content">
    <el-card v-for="item in store.news" :key="item._id">
      <template #header>
        <div class="flex justify-between">
          {{ item.title }}
        </div>
        <div>{{ item.author.username }} ({{ item.publishedAt }})</div>
      </template>
      <p v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</p>
      <template #footer>Footer content</template>
    </el-card>
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
