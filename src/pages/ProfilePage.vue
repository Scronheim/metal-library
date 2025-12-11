<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import { useStore } from '@/stores/store'
import { useAuthStore } from '@/stores/auth'

import AlbumSearch from '@/components/inputs/AlbumSearch.vue'
import GroupSearch from '@/components/inputs/GroupSearch.vue'
import DeleteIconButton from '@/components/buttons/DeleteIconButton.vue'

import type { Album, Group, User } from '@/types'

const store = useStore()
const authStore = useAuthStore()

// Computed
const user = computed((): User => authStore.user)

// Refs

// Methods
const addFavoriteAlbum = (album: Album): void => {
  authStore.user.profile.favoriteAlbums.push(album)
}
const removeFavoriteAlbum = (index: number): void => {
  authStore.user.profile.favoriteAlbums.splice(index, 1)
}
const addFavoriteGroup = (group: Group): void => {
  authStore.user.profile.favoriteGroups.push(group)
}
const removeFavoriteGroup = (index: number): void => {
  authStore.user.profile.favoriteGroups.splice(index, 1)
}

onMounted(async () => {})
</script>

<template>
  <el-container class="profile-main-content">
    <el-card>
      <div class="flex flex-col gap-2">
        <el-descriptions :title="`Профиль ${authStore.user.username}`" border>
          <el-descriptions-item label="Имя пользователя">{{ authStore.user.username }}</el-descriptions-item>
          <el-descriptions-item label="Email">{{ authStore.user.email }}</el-descriptions-item>
          <el-descriptions-item label="Роль">{{ authStore.user.role }}</el-descriptions-item>
          <el-descriptions-item label="Групп добавлено">{{ authStore.user.stats.groupsAdded }}</el-descriptions-item>
          <el-descriptions-item label="Альбомов добавлено">{{ authStore.user.stats.albumsAdded }}</el-descriptions-item>
          <el-descriptions-item label="Обзоров написано">
            {{ authStore.user.stats.reviewsWritten }}
          </el-descriptions-item>
        </el-descriptions>
        <el-input type="textarea" v-model="authStore.user.profile.bio" placeholder="Напишите о себе" />
        <el-collapse>
          <el-collapse-item title="Любимые группы" name="favoriteGroups">
            <GroupSearch class="mb-2" @select="addFavoriteGroup" />
            <div class="grid grid-cols-6 gap-2">
              <el-card
                v-for="(group, index) in user.profile.favoriteGroups"
                :key="group._id"
                class="album-card"
                shadow="hover"
                @click="$router.push(`/group/${group._id}`)"
              >
                <div class="album-cover">
                  <el-image :src="group.banner" :alt="group.name" fit="cover" class="cover-image" />
                </div>
                <div class="album-info">
                  <h4 class="album-title">{{ group.name }}</h4>
                  <p class="album-year">{{ group.formedYear }}</p>
                </div>
                <template #footer>
                  <DeleteIconButton @confirm="removeFavoriteGroup(index)" />
                </template>
              </el-card>
            </div>
          </el-collapse-item>
          <el-collapse-item title="Любимые альбомы" name="favoriteAlbums">
            <AlbumSearch class="mb-2" @select="addFavoriteAlbum" />
            <div class="grid grid-cols-6 gap-2">
              <el-card
                v-for="(album, index) in user.profile.favoriteAlbums"
                :key="album._id"
                class="album-card"
                shadow="hover"
                @click="$router.push(`/album/${album._id}`)"
              >
                <div class="album-cover">
                  <el-image :src="album.cover" :alt="album.title" fit="cover" class="cover-image" />
                </div>
                <div class="album-info">
                  <h4 class="group-title">{{ album.groups.map(g => g.name).join(', ') }}</h4>
                  <h4 class="album-title">{{ album.title }}</h4>
                  <p class="album-year">{{ new Date(album.releaseDate).getFullYear() }}</p>
                </div>
                <template #footer>
                  <DeleteIconButton @confirm="removeFavoriteAlbum(index)" />
                </template>
              </el-card>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <template #footer>
        <div class="flex justify-end">
          <el-button type="success" @click="authStore.updateUser(true)">Сохранить</el-button>
        </div>
      </template>
    </el-card>
  </el-container>
</template>

<style lang="css" scoped>
.profile-main-content {
  max-width: 1200px;
  margin: 10px auto;
  padding: 0 20px;
  flex-direction: column;
}
.album-card {
  background: #252525;
  border: 1px solid #333;
  max-width: 200px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.album-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  border-color: #9e2a2a;
}
.cover-image {
  width: 100%;
  height: 100%;
}
.album-cover {
  position: relative;
  overflow: hidden;
}
.album-info {
  flex: 1;
  padding: 12px 12px 0 12px;
}

.group-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 6px 0;
  color: #f5f5f5;
  line-height: 1.3;
  overflow: hidden;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.album-title {
  font-size: 0.8rem;
  font-weight: 600;
  margin: 0 0 6px 0;
  color: #a2a2a2;
  line-height: 1.3;
  overflow: hidden;
  display: -webkit-box;
  line-clamp: 2;
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

.album-stats .stat {
  display: flex;
  align-items: center;
  gap: 4px;
}

.empty-albums {
  padding: 60px 0;
}
</style>
