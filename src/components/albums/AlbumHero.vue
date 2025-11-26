<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mdiCalendar, mdiThumbUp } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'
import { ElMessage } from 'element-plus'
import { Headset, Timer, Star, StarFilled, Share, View, Edit, Plus, Close, Picture } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import durationPlugin from 'dayjs/plugin/duration'

import { useStore } from '@/stores/store'
import { useAuthStore } from '@/stores/auth'

import EditAlbumDialog from '@/components/dialogs/EditAlbumDialog.vue'

import { ElNotification } from 'element-plus'
import { formatDate } from '@/utils'

const router = useRouter()

const store = useStore()
const authStore = useAuthStore()

const emit = defineEmits(['updateAlbum'])

dayjs.extend(durationPlugin)

// Computed
const album = computed(() => store.currentAlbum)
const isAuthenticated = computed((): boolean => authStore.userIsAuth)
const userLikedAlbum = computed(
  (): boolean => !store.currentAlbum.stats.likes.findIndex(u => u._id === authStore.user.id)
)
const albumReleaseYear = computed((): number => new Date(store.currentAlbum.releaseDate).getFullYear())
const albumTotalDuration = computed((): string => {
  const totalSeconds = store.currentAlbum.tracks.reduce((total, track) => {
    const [hours, minutes, seconds] = track.duration.split(':').map(i => parseInt(i))
    return total + dayjs.duration({ hours, minutes, seconds }).asSeconds()
  }, 0)

  return dayjs.duration(totalSeconds, 'seconds').format('HH:mm:ss')
})

const showAlbumInfoEdit = ref(false)

// Methods
const toggleFavorites = async (): Promise<void> => {
  if (store.albumInFavorites) {
    const index = authStore.user.profile.favoriteAlbums.findIndex(a => a._id === album.value._id)
    authStore.user.profile.favoriteAlbums.splice(index, 1)
    ElMessage.success('Альбом убран из любимых')
  } else {
    authStore.user.profile.favoriteAlbums.push(album.value)
    ElMessage.success('Альбом добавлен в любимые')
  }
  await authStore.updateUser()
}
const goToAlbumReviewPage = () => {
  router.push({ name: 'albumReviews' })
}
const toggleLike = async () => {
  try {
    const { newAlbum, message } = await store.toggleLike(store.currentAlbum)
    ElNotification({
      type: 'success',
      message
    })
    store.currentAlbum = newAlbum
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
const openAlbumInfoEditDialog = async (): Promise<void> => {
  await store.getGenres()
  showAlbumInfoEdit.value = true
}
</script>

<template>
  <section class="album-hero">
    <div class="hero-container">
      <div class="album-cover">
        <el-image :src="store.currentAlbum.cover" :alt="store.currentAlbum.title" fit="cover" class="cover-image">
          <template #error>
            <div class="image-error">
              <el-icon><Picture /></el-icon>
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

        <h1 class="album-title">
          <RouterLink :to="`/album/${album._id}`">{{ album.title }}</RouterLink>
        </h1>

        <div class="album-artist">
          <template v-for="(group, index) in album.groups">
            <span class="artist-name" @click="$router.push(`/group/${group._id}`)">{{ group.name }}</span>
            {{ index === album.groups.length - 1 ? '' : '/' }}
          </template>
        </div>

        <div class="album-genres">
          <el-tag v-for="genre in album.genres" :key="genre._id" type="danger" effect="dark" class="genre-tag">
            {{ genre.name }}
          </el-tag>
        </div>

        <div class="album-meta">
          <div class="meta-item">
            <SvgIcon type="mdi" :path="mdiCalendar" :size="18" />
            <el-tooltip :content="formatDate(album.releaseDate, 'DD MMMM YYYY')">
              <span>{{ albumReleaseYear }}г.</span>
            </el-tooltip>
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
          <div class="meta-item">
            <el-icon>
              <View />
            </el-icon>
            <span>{{ album.stats.views }} просмотров</span>
          </div>
          <div class="meta-item">
            <SvgIcon type="mdi" :path="mdiThumbUp" :size="18" />
            <span>{{ album.stats.likes.length }} лайков</span>
          </div>
        </div>

        <div class="album-actions">
          <el-button type="danger" :icon="userLikedAlbum ? StarFilled : Star" @click="toggleLike">
            {{ album.stats.likes.length }}
          </el-button>
          <el-button
            v-if="authStore.userIsAuth"
            :type="store.albumInFavorites ? 'danger' : 'success'"
            :icon="store.albumInFavorites ? Close : Plus"
            @click="toggleFavorites"
          >
            {{ store.albumInFavorites ? 'Убрать из любимых' : 'В любимые' }}
          </el-button>
          <el-button type="primary" :icon="Share" @click="shareAlbum">Поделиться</el-button>
          <el-button v-if="isAuthenticated" type="warning" :icon="View" @click="goToAlbumReviewPage">Обзоры</el-button>
          <el-button v-if="authStore.userIsAdmin" type="info" :icon="Edit" @click="openAlbumInfoEditDialog">
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
    :album="store.currentAlbum"
    :groups="store.currentAlbum.groups"
    mode="edit"
    @success="emit('updateAlbum')"
    @close="showAlbumInfoEdit = false"
  />
</template>

<style lang="css" scoped>
.album-genres {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.genre-tag {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.genre-tag:hover {
  transform: translateY(-2px);
}
.album-info-section {
  width: 100%;
}
.album-hero {
  background: linear-gradient(135deg, #1a1a1a 0%, #2a1a1a 100%);
  padding: 20px 0;
  margin-bottom: 20px;
}
.cover-image {
  width: 100%;
  height: 100%;
}
.image-error {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  width: 300px;
  height: 300px;
  background: #6c6e72;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.album-cover {
  position: relative;
  overflow: hidden;
  width: 450px;
}

.album-cover-section {
  flex-shrink: 1;
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
  margin-bottom: 24px;
  gap: 10px;
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
  gap: 8px;
  flex-wrap: wrap;
}
</style>
