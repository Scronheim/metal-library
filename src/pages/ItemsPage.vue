<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import { useStore } from '@/stores/store'

import type { Item } from '@/types'

const store = useStore()

const filter = ref<string>('')
const activeTab = ref<string>('search')

const items = computed((): Item[] => {
  return store.items.filter((item: Item) => item.name.toUpperCase().indexOf(filter.value.toUpperCase()) >= 0)
})

onMounted(async () => {
  await store.getItems()
})
</script>

<template>
  <el-card header="Необходимые предметы">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="Поиск" name="search">
        <el-input v-model="filter" placeholder="Фильтр" class="mb-3" />
        <div class="grid grid-cols-6 gap-3">
          <el-card v-for="item in items" :key="item._id" :header="item.name">
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
