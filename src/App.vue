<script setup lang="ts">
import { HomeFilled } from '@element-plus/icons-vue'

import SearchBar from './components/SearchBar.vue'
import UserBar from './components/UserBar.vue'
</script>

<template>
  <div class="flex items-center justify-between p-2 font-bold bg-gray-600">
    <el-button tag="router-link" to="/" type="info" :icon="HomeFilled" />
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
</template>

<style scoped></style>
