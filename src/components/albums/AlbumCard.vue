<script setup lang="ts">
import { type PropType } from 'vue'
import { Star, Headset, View, Picture } from '@element-plus/icons-vue'

import { useStore } from '@/stores/store'

import type { Album } from '@/types'

const props = defineProps({
  album: {
    type: Object as PropType<Album>,
    required: true
  }
})

const store = useStore()
</script>

<template>
  <el-card class="album-card" shadow="hover" @click="$router.push(`/album/${props.album._id}`)">
    <div class="album-cover">
      <el-image :src="props.album.cover" :alt="props.album.title" fit="cover" class="cover-image">
        <template #error>
          <div class="image-error">
            <el-icon><Picture /></el-icon>
          </div>
        </template>
      </el-image>
      <el-tag v-if="props.album.type" :type="store.albumTypeColorMap[props.album.type]" class="album-type-tag">
        {{ store.albumTypesMap[props.album.type] }}
      </el-tag>
    </div>
    <div class="album-info">
      <h4 class="album-title">{{ props.album.title }}</h4>
      <p class="album-year">{{ new Date(props.album.releaseDate).getFullYear() }}</p>
      <p class="album-label" v-if="props.album.label">{{ props.album.label }}</p>
      <div class="album-meta">
        <span class="tracks-count" v-if="props.album.tracks">
          <el-icon>
            <Headset />
          </el-icon>
          {{ props.album.tracks.length }} треков
        </span>
      </div>
      <div class="album-stats">
        <span class="stat">
          <el-icon>
            <View />
          </el-icon>
          {{ props.album.stats.views }}
        </span>
        <span class="stat">
          <el-icon>
            <Star />
          </el-icon>
          {{ props.album.stats.likes.length }}
        </span>
      </div>
    </div>
  </el-card>
</template>

<style lang="css" scoped>
.cover-image {
  width: 100%;
  height: 100%;
}
.image-error {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  height: 200px;
  background: #6c6e72;
}
:deep(.el-card__body) {
  padding: 0;
}
.album-card {
  background: #252525;
  border: 1px solid #333;
  cursor: pointer;
  transition: all 0.3s ease;
}

.album-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  border-color: #9e2a2a;
}

.album-cover {
  position: relative;
  overflow: hidden;
}
.album-type-tag {
  position: absolute;
  top: 8px;
  right: 8px;
}

.album-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.album-title {
  font-size: 1rem;
  font-weight: 600;
  color: #f5f5f5;
  line-height: 1.3;
  overflow: hidden;
  display: -webkit-box;
  text-align: center;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.album-year {
  color: #9e2a2a;
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0 0 6px 0;
}

.album-label {
  color: #aaa;
  font-size: 0.8rem;
  margin: 0 0 10px 0;
}

.album-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.75rem;
  color: #777;
}

.album-meta .tracks-count,
.album-meta .duration {
  display: flex;
  align-items: center;
  gap: 4px;
}

.album-stats {
  display: flex;
  gap: 12px;
  font-size: 0.75rem;
  color: #777;
}
</style>
