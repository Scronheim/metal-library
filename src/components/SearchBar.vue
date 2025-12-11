<template>
  <div class="search-bar">
    <el-popover placement="bottom" :width="400" trigger="click" v-model:visible="popoverVisible">
      <template #reference>
        <el-button :icon="Search" circle class="search-button" />
      </template>

      <div class="search-popover">
        <el-autocomplete
          v-model="searchQuery"
          :fetch-suggestions="performQuickSearch"
          placeholder="Введите название группы или альбома"
          clearable
          value-key="name"
          autofocus
          @select="navigateToItem"
        >
          <template #default="{ item }">
            <div class="flex items-center gap-2">
              <div class="item-avatar">
                <el-avatar :size="32" :src="getItemImage(item)" />
              </div>
              <div class="flex flex-col item-info">
                <div class="item-title">{{ getItemTitle(item) }}</div>
                <div class="item-subtitle">{{ getItemSubtitle(item) }}</div>
              </div>
              <div class="item-type">
                <el-tag size="small" :type="item.status ? 'danger' : 'primary'">
                  {{ item.status ? 'Группа' : 'Альбом' }}
                </el-tag>
              </div>
            </div>
          </template>
        </el-autocomplete>
        <!-- Loading State -->
        <div class="loading-state" v-if="isLoading">
          <el-skeleton :rows="3" animated />
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Headset, CircleCheck } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { onKeyStroke } from '@vueuse/core'

import type { Album, Group } from '@/types'

const router = useRouter()

// Refs
const searchQuery = ref('')
const popoverVisible = ref(false)
const quickResults = ref<Group[] | Album[]>([])
const isLoading = ref(false)
const searchInputRef = ref(null)

// Methods
const getItemImage = item => {
  return item.type === 'group' ? item.logo : item.cover
}

const getItemIcon = item => {
  return item.type === 'group' ? Headset : CircleCheck
}

const getItemTitle = item => {
  return item.type === 'group' ? item.name : item.title
}

const getItemSubtitle = item => {
  if (item.type === 'group') {
    return `${item.country} • ${item.formedYear}`
  } else {
    return item.groups.map(g => g.name).join(', ')
  }
}

const performQuickSearch = async (query: string, cb: any) => {
  try {
    if (!query) return cb([])

    isLoading.value = true

    // Search groups and albums simultaneously
    const [groupsResponse, albumsResponse] = await Promise.all([
      fetch(`/api/group?search=${encodeURIComponent(query)}&limit=3`),
      fetch(`/api/album?search=${encodeURIComponent(query)}&limit=3`)
    ])

    const groupsData = groupsResponse.ok ? await groupsResponse.json() : { groups: [] }
    const albumsData = albumsResponse.ok ? await albumsResponse.json() : { albums: [] }

    // Combine and limit results
    const groups = groupsData.groups.map(group => ({ ...group, type: 'group' }))
    const albums = albumsData.albums.map(album => ({ ...album, type: 'album' }))
    cb([...groups, ...albums].slice(0, 5))
  } catch (error) {
    console.error('Search error:', error)
    ElMessage.error('Ошибка при поиске')
  } finally {
    isLoading.value = false
  }
}

const navigateToItem = item => {
  popoverVisible.value = false
  if (item.type === 'group') {
    router.push(`/group/${item._id}`)
  } else {
    router.push(`/album/${item._id}`)
  }
  searchQuery.value = ''
  quickResults.value = []
}

// Focus input when popover opens
watch(popoverVisible, newVal => {
  if (newVal) {
    nextTick(() => {
      if (searchInputRef.value) {
        searchInputRef.value.focus()
      }
    })
  } else {
    searchQuery.value = ''
    quickResults.value = []
  }
})

onMounted(() => {
  onKeyStroke(['f', 'а'], (e: KeyboardEvent) => {
    if (e.ctrlKey) {
      e.preventDefault()
      popoverVisible.value = true
    }
  })
})
</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
}

.search-button {
  background: transparent;
  border: 1px solid #444;
  color: #f5f5f5;
}

.search-button:hover {
  background: #9e2a2a;
  border-color: #9e2a2a;
  color: white;
}

.search-popover {
  padding: 0;
}

.quick-results {
  max-height: 400px;
  overflow-y: auto;
}

.results-section {
  padding: 8px 0;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #2a2a2a;
}

.result-item:last-child {
  border-bottom: none;
}

.result-item:hover {
  background: #252525;
}

.item-avatar {
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: #f5f5f5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-subtitle {
  font-size: 0.75rem;
  color: #aaa;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-type {
  flex-shrink: 0;
}

.search-footer {
  padding: 12px 16px;
  border-top: 1px solid #333;
  text-align: center;
}

.view-all-btn {
  color: #9e2a2a;
  font-size: 0.85rem;
}

.empty-state {
  padding: 40px 20px;
  text-align: center;
  color: #666;
}

.empty-state i {
  font-size: 2rem;
  margin-bottom: 12px;
  display: block;
}

.empty-state p {
  margin: 0;
  font-size: 0.9rem;
}

.loading-state {
  padding: 20px;
}
</style>
