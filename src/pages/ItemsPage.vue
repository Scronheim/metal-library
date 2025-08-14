<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue'

import { useStore } from '@/stores/store'

const store = useStore()
</script>

<template>
  <el-card header="Необходимые предметы">
    <el-input v-model="store.itemFilter" placeholder="Фильтр" class="mb-3" autofocus clearable />
    <el-scrollbar :height="store.items.length ? '260px' : '0'" always>
      <div class="grid grid-cols-6 gap-3">
        <el-card v-for="item in store.items" :key="item._id" :header="item.name" shadow="never">
          <div class="flex flex-col items-center gap-3">
            <img :src="item.iconLink" />
            <el-button :type="store.checkItemIsNecessary(item) ? 'danger' : 'success'" @click="store.toggleNecessaryItem(item)">
              {{ store.checkItemIsNecessary(item) ? 'Убрать' : 'Добавить' }}
            </el-button>
          </div>
        </el-card>
      </div>
    </el-scrollbar>
    <el-divider />
    <div class="grid grid-cols-6 gap-3">
      <el-card v-for="item in store.user.necessaryItems" :key="item.item._id" shadow="never">
        <template #header>
          <div class="flex justify-between">
            {{ item.item.name }}
            <el-tooltip content="Убрать из необходимых" placement="top">
              <el-button :icon="Delete" type="danger" size="small" circle @click="store.toggleNecessaryItem(item.item)" />
            </el-tooltip>
          </div>
        </template>
        <div class="flex flex-col items-center gap-3">
          <img :src="item.item.iconLink" />
          <el-text>Найдено</el-text>
          <el-input-number v-model="item.itemCount" :min="0" :max="item.count" />
          <el-text>из</el-text>
          <el-input-number v-model="item.count" :min="1" />
        </div>
      </el-card>
    </div>
  </el-card>
</template>
