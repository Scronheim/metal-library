<script setup lang="ts">
import { ref } from 'vue'

import { useStore } from '@/stores/store'

import type { Group } from '@/types'

const emit = defineEmits(['select'])

const store = useStore()

const searchGroupQuery = ref('')
const foundedGroups = ref<Group[]>([])

const searchGroup = async (queryString: string, cb: any): Promise<void> => {
  if (!queryString) return cb([])
  const { data } = await store.searchGroup(queryString)
  foundedGroups.value = data.groups
  cb(data.groups)
}
const handleSelectGroup = (group: Group): void => {
  emit('select', group)
}
</script>

<template>
  <el-autocomplete
    v-model="searchGroupQuery"
    :fetch-suggestions="searchGroup"
    clearable
    value-key="name"
    placeholder="Введите название группы"
    @select="handleSelectGroup"
  />
</template>
