<template>
  <div class="search-bar">
    <el-popover placement="bottom" :width="400" trigger="click" v-model:visible="popoverVisible">
      <template #reference>
        <el-button :icon="Search" circle class="search-button" />
      </template>

      <div class="search-popover">
        <el-input
          v-model="searchQuery"
          placeholder="Поиск групп или альбомов..."
          :prefix-icon="Search"
          clearable
          @input="handleSearchInput"
          @keyup.enter="performSearch"
          ref="searchInputRef"
        />

        <!-- Quick Results -->
        <div class="quick-results" v-if="quickResults.length > 0 && searchQuery">
          <div class="results-section">
            <div v-for="item in quickResults" :key="item._id" class="result-item" @click="navigateToItem(item)">
              <div class="item-avatar">
                <el-avatar :size="32" :src="getItemImage(item)" :shape="item.type === 'group' ? 'square' : 'square'">
                  <i :class="getItemIcon(item)"></i>
                </el-avatar>
              </div>
              <div class="item-info">
                <div class="item-title">{{ getItemTitle(item) }}</div>
                <div class="item-subtitle">{{ getItemSubtitle(item) }}</div>
              </div>
              <div class="item-type">
                <el-tag size="small" :type="item.type === 'group' ? 'danger' : 'primary'">
                  {{ item.type === 'group' ? 'Группа' : 'Альбом' }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div class="empty-state" v-else-if="searchQuery && !isLoading">
          <i class="el-icon-search"></i>
          <p>Ничего не найдено</p>
        </div>

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
import { Search } from '@element-plus/icons-vue'
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
const searchTimeout = ref(null)

// Methods
const getItemImage = item => {
  return item.type === 'group' ? item.logo : item.cover
}

const getItemIcon = item => {
  return item.type === 'group' ? 'el-icon-headset' : 'el-icon-disc'
}

const getItemTitle = item => {
  return item.type === 'group' ? item.name : item.title
}

const getItemSubtitle = item => {
  if (item.type === 'group') {
    return `${item.country} • ${item.formedYear}`
  } else {
    return item.group?.name || 'Неизвестный исполнитель'
  }
}

const handleSearchInput = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  if (!searchQuery.value.trim()) {
    quickResults.value = []
    return
  }

  isLoading.value = true
  searchTimeout.value = setTimeout(async () => {
    await performQuickSearch()
    isLoading.value = false
  }, 300)
}

const performQuickSearch = async () => {
  try {
    const query = searchQuery.value.trim()
    if (!query) return

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

    quickResults.value = [...groups, ...albums].slice(0, 5)
  } catch (error) {
    console.error('Search error:', error)
    ElMessage.error('Ошибка при поиске')
  }
}

const performSearch = () => {
  if (!searchQuery.value.trim()) return

  showAllResults()
}

const showAllResults = () => {
  if (!searchQuery.value.trim()) return

  popoverVisible.value = false
  router.push({
    path: '/search',
    query: { q: searchQuery.value.trim() }
  })
  searchQuery.value = ''
  quickResults.value = []
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
  onKeyStroke('f', (e: KeyboardEvent) => {
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
  margin-bottom: 2px;
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
