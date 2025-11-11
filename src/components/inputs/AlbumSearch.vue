<script setup lang="ts">
import { ref } from 'vue'

import { useStore } from '@/stores/store'

import type { Album } from '@/types'

const emit = defineEmits(['select'])

const store = useStore()

const searchAlbumQuery = ref('')
const foundedAlbums = ref<Album[]>([])

const searchAlbum = async (queryString: string, cb: any): Promise<void> => {
  if (!queryString) return cb([])
  const { data } = await store.searchAlbum(queryString)
  foundedAlbums.value = data.albums
  cb(data.albums)
}
const handleSelectAlbum = (album: Album): void => {
  emit('select', album)
}
</script>

<template>
  <el-autocomplete
    v-model="searchAlbumQuery"
    :fetch-suggestions="searchAlbum"
    clearable
    value-key="title"
    placeholder="Введите название альбома"
    @select="handleSelectAlbum"
  >
    <template #default="{ item }">{{ item.title }} ({{ item.group.name }})</template>
  </el-autocomplete>
</template>
