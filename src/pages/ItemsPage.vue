<script setup lang="ts">
import { ref } from 'vue'

import { useStore } from '@/stores/store'

const store = useStore()

const activeTab = ref<string>('search')
</script>

<template>
  <el-card header="Необходимые предметы">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="Поиск" name="search">
        <el-input v-model="store.itemFilter" placeholder="Фильтр" class="mb-3" @input="store.searchItem" />
        <div class="grid grid-cols-6 gap-3">
          <el-card v-for="item in store.items" :key="item._id" :header="item.name">
            <div class="flex justify-center">
              <img :src="item.iconLink" />
            </div>
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Добавленные" name="added">Добавленные</el-tab-pane>
    </el-tabs>
  </el-card>
</template>
