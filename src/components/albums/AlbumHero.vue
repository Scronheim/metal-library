<script setup lang="ts">
import { ref, computed, type PropType } from 'vue'
import { mdiCalendar, mdiAlbum, mdiMusic } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'
import { Headset, Timer, Star, StarFilled, Share, Plus, Edit } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import durationPlugin from 'dayjs/plugin/duration'

import { useStore } from '@/stores/store'

import EditAlbumDialog from '@/components/dialogs/EditAlbumDialog.vue'

import type { Album } from '@/types'
import { ElNotification } from 'element-plus'

const store = useStore()

const emit = defineEmits(['updateAlbum'])
const props = defineProps({
  album: {
    type: Object as PropType<Album>,
    required: true
  }
})

dayjs.extend(durationPlugin)

// Computed
const isAuthenticated = computed((): boolean => store.userIsAuth)
const userLikedAlbum = computed((): boolean => !props.album.stats.likes.findIndex(u => u._id === store.user.id))
const albumReleaseYear = computed((): number => new Date(props.album.releaseDate).getFullYear())
const albumGenres = computed((): string => props.album.genres.map(g => g.name).join(', '))
const albumTotalDuration = computed((): string => {
  const totalSeconds = props.album.tracks.reduce((total, track) => {
    const [hours, minutes, seconds] = track.duration.split(':').map(i => parseInt(i))
    return total + dayjs.duration({ hours, minutes, seconds }).asSeconds()
  }, 0)

  return dayjs.duration(totalSeconds, 'seconds').format('HH:mm:ss')
})

const showAlbumInfoEdit = ref(false)

// Methods
const toggleLike = async () => {
  try {
    const { newAlbum, message } = await store.toggleLike(props.album)
    ElNotification({
      type: 'success',
      message
    })
    props.album = newAlbum
  } catch (error) {
    ElNotification({
      type: 'error',
      message: error.message
    })
  }
}
const shareAlbum = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    ElNotification({
      type: 'success',
      message: 'Ссылка скопирована в буфер обмена'
    })
  } catch (error) {
    ElNotification({
      type: 'error',
      message: 'Ошибка при копировании ссылки'
    })
  }
}
const addToCollection = () => {
  ElNotification({
    type: 'success',
    message: 'Альбом добавлен в коллекцию'
  })
}
const openAlbumInfoEditDialog = async (): Promise<void> => {
  await store.getGenres()
  showAlbumInfoEdit.value = true
}
</script>

<template>
  <section class="album-hero">
    <div class="hero-container">
      <div class="album-cover-section">
        <el-image :src="props.album.cover" :alt="props.album.title" fit="cover" class="album-cover">
          <template #error>
            <div class="cover-placeholder">
              <SvgIcon type="mdi" :path="mdiAlbum" :size="18" />
            </div>
          </template>
        </el-image>
      </div>

      <div class="album-info-section">
        <div class="album-type-tag">
          <el-tag :type="store.albumTypeColorMap[album.type]" size="large">
            {{ store.albumTypesMap[album.type] }}
          </el-tag>
        </div>

        <h1 class="album-title">{{ album.title }}</h1>

        <div class="album-artist">
          <el-avatar :size="40" :src="album.group.logo" :alt="album.group.name" shape="square" class="artist-logo">
            <el-icon v-if="!album.group.logo">
              <Headset />
            </el-icon>
          </el-avatar>
          <span class="artist-name" @click="$router.push(`/groups/${album.group._id}`)">
            {{ album.group.name }}
          </span>
        </div>

        <div class="album-meta">
          <div class="meta-item">
            <SvgIcon type="mdi" :path="mdiCalendar" :size="18" />
            <span>{{ albumReleaseYear }}г.</span>
          </div>
          <div class="meta-item" v-if="album.genres.length">
            <SvgIcon type="mdi" :path="mdiMusic" :size="18" />
            <span>{{ albumGenres }}</span>
          </div>
          <div class="meta-item">
            <el-icon>
              <Timer />
            </el-icon>
            <span>{{ albumTotalDuration }}</span>
          </div>
          <div class="meta-item">
            <el-icon>
              <Headset />
            </el-icon>
            <span>{{ album.tracks.length }} треков</span>
          </div>
        </div>

        <div class="album-stats">
          <div class="stat">
            <span class="stat-number">{{ album.stats.views }}</span>
            <span class="stat-label">просмотров</span>
          </div>
          <div class="stat">
            <span class="stat-number">{{ album.stats.likes.length }}</span>
            <span class="stat-label">лайков</span>
          </div>
        </div>

        <div class="album-actions">
          <el-button type="danger" :icon="userLikedAlbum ? StarFilled : Star" @click="toggleLike">
            {{ album.stats.likes.length }}
          </el-button>
          <el-button type="primary" :icon="Share" @click="shareAlbum">Поделиться</el-button>
          <el-button v-if="isAuthenticated" type="success" :icon="Plus" @click="addToCollection">В коллекцию</el-button>
          <el-button v-if="store.userIsAdmin" type="info" :icon="Edit" @click="openAlbumInfoEditDialog">
            Редактировать
          </el-button>
        </div>
        <el-divider />
        <div class="album-actions">
          <el-button
            v-for="link in album.socialLinks"
            :key="link.platform"
            :type="store.socialLinkColorMap[link.platform]"
            :icon="store.socialLinkIconsMap[link.platform]"
            tag="a"
            :href="link.url"
            target="_blank"
          >
            {{ store.socialPlatformNamesMap[link.platform] }}
          </el-button>
        </div>
      </div>
    </div>
  </section>

  <EditAlbumDialog
    v-model="showAlbumInfoEdit"
    :album="props.album"
    mode="edit"
    :group="props.album.group"
    @success="emit('updateAlbum')"
  />
</template>

<style lang="css" scoped>
.album-hero {
  background: linear-gradient(135deg, #1a1a1a 0%, #2a1a1a 100%);
  padding: 20px 0;
  margin-bottom: 20px;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.album-cover {
  position: relative;
  overflow: hidden;
  max-width: 300px;
}

.album-cover-section {
  flex-shrink: 1;
}

.cover-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #252525;
  color: #666;
  font-size: 80px;
  border-radius: 12px;
}

.album-info-section {
  flex: 1;
}

.album-type-tag {
  margin-bottom: 20px;
}

.album-title {
  font-size: 3rem;
  font-weight: bold;
  margin: 0 0 16px 0;
  color: #fff;
  line-height: 1.1;
}

.album-artist {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.artist-logo {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.artist-logo:hover {
  transform: scale(1.05);
}

.artist-name {
  font-size: 1.3rem;
  color: #9e2a2a;
  cursor: pointer;
  transition: color 0.2s ease;
}

.artist-name:hover {
  color: #b33c3c;
  text-decoration: underline;
}

.album-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #e0e0e0;
  font-size: 1rem;
}

.album-stats {
  display: flex;
  gap: 30px;
}

.stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #f5f5f5;
}

.stat-label {
  display: block;
  font-size: 0.9rem;
  color: #aaa;
  text-transform: lowercase;
}

.album-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
