<template>
  <div class="album-page" v-if="album">
    <!-- Hero Section -->
    <section class="album-hero">
      <div class="hero-container">
        <div class="album-cover-section">
          <el-image :src="album.cover" :alt="album.title" fit="cover" class="album-cover">
            <template #error>
              <div class="cover-placeholder">
                <SvgIcon type="mdi" :path="mdiAlbum" :size="18" />
              </div>
            </template>
          </el-image>
        </div>

        <div class="album-info-section">
          <div class="album-type-tag">
            <el-tag :type="getAlbumTypeTagType(album.type)" size="large">
              {{ getAlbumTypeLabel(album.type) }}
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
              <span>{{ album.releaseYear }}г.</span>
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
            <el-button v-if="isAuthenticated" type="success" :icon="Plus" @click="addToCollection">
              В коллекцию
            </el-button>
            <el-button v-if="store.userIsAdmin" type="info" :icon="Edit" @click="showAlbumInfoEdit = true">
              Редактировать
            </el-button>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <el-container class="album-main-content">
      <!-- Left Column - Tracklist -->
      <el-col :xs="24" :lg="16" class="left-column">
        <!-- Album Description -->
        <el-card class="description-card" v-if="album.description">
          <template #header>
            <h3>Об альбоме</h3>
          </template>
          <div class="description-content">
            <p>{{ album.description }}</p>
          </div>
        </el-card>
        <el-card class="tracklist-card">
          <template #header>
            <div class="tracklist-header">
              <div class="flex gap-2 items-center">
                <h3>Треклист</h3>
                <AddIconButton v-if="store.userIsAdmin" @click="addLyrics" />
              </div>
              <div class="tracklist-stats">
                <span>Всего: {{ album.tracks.length }} треков</span>
                <span class="ml-1">• {{ albumTotalDuration }}</span>
              </div>
            </div>
          </template>
          <div class="tracklist">
            <div
              v-for="(track, index) in album.tracks"
              :key="track.number"
              class="track-item"
              :class="{ 'has-lyrics': trackHasLyrics(track) }"
            >
              <div class="track-main" @click="toggleTrackLyrics(track)">
                <div class="track-number">
                  {{ track.number }}
                </div>

                <div class="track-info">
                  <h4 class="track-title">{{ track.title }}</h4>
                  <div class="track-meta">
                    <span class="track-duration">{{ track.duration }}</span>
                    <el-tag v-if="trackHasLyrics(track)" size="small" type="info" class="lyrics-tag">есть текст</el-tag>
                  </div>
                </div>

                <div class="track-actions">
                  <EditIconButton v-if="store.userIsAdmin" @click="editLyrics(track)" />
                  <DeleteIconButton @confirm="removeTrack(index)" />
                </div>
              </div>

              <!-- Lyrics Section -->
              <el-collapse-transition>
                <div v-show="isTrackExpanded(track.number)" class="track-lyrics">
                  <div class="lyrics-content">
                    <div class="flex gap-2">
                      <h5>Текст песни</h5>
                    </div>
                    <pre class="lyrics-text">{{ track.lyrics }}</pre>
                  </div>
                </div>
              </el-collapse-transition>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- Right Column - Sidebar -->
      <el-col :xs="24" :lg="8" class="right-column">
        <!-- Group Info -->
        <section class="sidebar-section">
          <div class="section-header">
            <h3 class="section-title">
              <el-icon>
                <Headset />
              </el-icon>
              Группа
              <EditIconButton
                v-if="store.userIsAdmin"
                @click="isGroupEdit = !isGroupEdit"
                :is-close-edit="isGroupEdit"
              />
            </h3>
          </div>
          <div v-if="isGroupEdit">
            <el-autocomplete
              v-model="searchQuery"
              :fetch-suggestions="searchGroup"
              clearable
              value-key="name"
              @select="handleSelectGroup"
            />
          </div>
          <div v-else class="group-info-card" @click="$router.push(`/groups/${album.group._id}`)">
            <el-avatar :size="60" :src="album.group.logo" :alt="album.group.name" shape="square" class="group-logo">
              <el-icon v-if="!album.group.logo">
                <Headset />
              </el-icon>
            </el-avatar>
            <div class="group-info">
              <h4 class="group-name">{{ album.group.name }}</h4>
              <p class="group-country">{{ album.group.country }}</p>
              <div class="group-genres">
                <el-text v-for="genre in album.group.genres.slice(0, 2)" :key="genre._id" size="small" type="primary">
                  {{ genre.name }}
                </el-text>
              </div>
            </div>
          </div>
        </section>

        <!-- Album Details -->
        <section class="sidebar-section">
          <div class="section-header">
            <h3 class="section-title">
              <el-icon>
                <InfoFilled />
              </el-icon>
              Детали
              <EditIconButton v-if="store.userIsAdmin" @click="showDetailsEdit" :is-close-edit="isDetailsEdit" />
            </h3>
          </div>
          <div class="details-list">
            <div class="detail-item">
              <span class="detail-label">Тип:</span>
              <span class="detail-value">
                <template v-if="isDetailsEdit">
                  <el-select v-model="album.type">
                    <el-option v-for="(value, key) in store.albumTypesMap" :label="value" :value="key" />
                  </el-select>
                </template>
                <template v-else>{{ getAlbumTypeLabel(album.type) }}</template>
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Жанры:</span>
              <span class="detail-value">
                <template v-if="isDetailsEdit">
                  <el-select multiple filterable value-key="name" v-model="album.genres">
                    <el-option v-for="genre in foundedGenres" :key="genre._id" :label="genre.name" :value="genre" />
                  </el-select>
                </template>
                <template v-else>{{ albumGenres }}</template>
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Дата выхода:</span>
              <span class="detail-value">
                <template v-if="isDetailsEdit">
                  <el-input type="date" v-model="album.releaseDate" />
                </template>
                <template v-else>{{ formatDate(album.releaseDate) }}</template>
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Лейбл:</span>
              <span class="detail-value">
                <template v-if="isDetailsEdit">
                  <el-input v-model="album.label" />
                </template>
                <template v-else>{{ album.label }}</template>
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Добавлен:</span>
              <span class="detail-value">{{ formatDate(album.createdAt) }}</span>
            </div>
          </div>
        </section>

        <!-- Other Albums by Group -->
        <section class="sidebar-section" v-if="otherAlbums.length">
          <div class="section-header">
            <h3 class="section-title">
              <SvgIcon type="mdi" :path="mdiAlbum" :size="18" />
              Другие альбомы
            </h3>
            <el-button type="text" size="small" @click="$router.push(`/groups/${album.group._id}`)">Все</el-button>
          </div>
          <div class="other-albums">
            <div
              v-for="otherAlbum in otherAlbums"
              :key="otherAlbum._id"
              class="other-album-item"
              @click="$router.push(`/albums/${otherAlbum._id}`)"
            >
              <div class="album-cover">
                <el-avatar :size="50" :src="otherAlbum.cover" :alt="otherAlbum.title" shape="square">
                  <SvgIcon v-if="!otherAlbum.cover" type="mdi" :path="mdiAlbum" :size="18" />
                </el-avatar>
              </div>
              <div class="album-info">
                <h5 class="album-title">{{ otherAlbum.title }}</h5>
                <p class="album-year-type">
                  {{ otherAlbum.releaseYear }} • {{ getAlbumTypeShortLabel(otherAlbum.type) }}
                </p>
                <div class="album-stats">
                  <span class="stat">
                    <el-icon>
                      <View />
                    </el-icon>
                    {{ otherAlbum.stats.views }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Related News -->
        <section class="sidebar-section" v-if="relatedNews.length">
          <div class="section-header">
            <h3 class="section-title">
              <i class="el-icon-news"></i>
              Связанные новости
            </h3>
          </div>
          <div class="related-news">
            <div
              v-for="news in relatedNews"
              :key="news._id"
              class="news-item"
              @click="$router.push(`/news/${news._id}`)"
            >
              <div class="news-image">
                <el-image :src="news.featuredImage" :alt="news.title" fit="cover" class="image">
                  <template #error>
                    <div class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </template>
                </el-image>
              </div>
              <div class="news-content">
                <h5 class="news-title">{{ news.title }}</h5>
                <p class="news-date">{{ formatDate(news.publishedAt) }}</p>
              </div>
            </div>
          </div>
        </section>
      </el-col>
    </el-container>
  </div>

  <!-- Loading State -->
  <div v-else class="loading-container">
    <el-skeleton :rows="10" animated />
  </div>

  <!-- Lyrics Edit Dialog -->
  <el-dialog v-model="showLyricsEdit" title="Редактирование текста" width="600px" :before-close="handleEditClose">
    <el-form :model="editingTrack" :rules="lyricsRules" label-position="top">
      <el-form-item label="Название трека" prop="title">
        <el-input v-model="editingTrack.title" placeholder="Введите название трека" />
      </el-form-item>
      <el-form-item label="№ трека" prop="number">
        <el-input-number :min="1" v-model.number="editingTrack.number" />
      </el-form-item>
      <el-form-item label="№ диска" prop="discNumber">
        <el-input-number :min="1" v-model.number="editingTrack.discNumber" />
      </el-form-item>
      <el-form-item label="Текст" prop="lyrics">
        <el-input v-model="editingTrack.lyrics" type="textarea" :rows="10" placeholder="Введите текст песни" />
      </el-form-item>
      <el-form-item label="Длительность" prop="duration">
        <el-input type="time" step="1" required v-model="editingTrack.duration">
          <template #suffix>сек.</template>
        </el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleEditClose">Отмена</el-button>
      <el-button type="success" @click="saveLyrics">Сохранить</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="showAlbumInfoEdit" title="Редактирование альбома" width="600px">
    <el-form :model="album" :rules="albumRules" label-position="top">
      <el-form-item label="Ссылка на обложку" prop="cover">
        <el-input v-model="album.cover" placeholder="Введите ссылку на обложку" />
        <el-image style="width: 300px; height: 300px" :src="album.cover">
          <template #error>
            <div class="cover-placeholder">
              <SvgIcon type="mdi" :path="mdiAlbum" :size="18" />
            </div>
          </template>
        </el-image>
      </el-form-item>
      <el-form-item label="Описание альбома" prop="description">
        <el-input v-model="album.description" type="textarea" :rows="10" placeholder="Введите описание альбома" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="showAlbumInfoEdit = false">Отмена</el-button>
      <el-button type="success" @click="saveAlbumInfo">Сохранить</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { debounce } from 'lodash-es'
import dayjs from 'dayjs'
import durationPlugin from 'dayjs/plugin/duration'
import { ElMessage, ElNotification, FormRules } from 'element-plus'
import { Headset, View, Timer, InfoFilled, Star, StarFilled, Share, Plus, Edit } from '@element-plus/icons-vue'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiCalendar, mdiAlbum, mdiMusic } from '@mdi/js'

import { useStore } from '@/stores/store'

import EditIconButton from '@/components/buttons/EditIconButton.vue'
import AddIconButton from '@/components/buttons/AddIconButton.vue'
import DeleteIconButton from '@/components/buttons/DeleteIconButton.vue'

import type { Album, Genre, Group, TrackInfo } from '@/types'

dayjs.extend(durationPlugin)

const route = useRoute()
const router = useRouter()
const store = useStore()
// Refs
const album = ref<Album>(null)
const otherAlbums = ref<Album[]>([])
const relatedNews = ref([])
const expandedTracks = ref(new Set())
const showLyricsEdit = ref(false)
const showAlbumInfoEdit = ref(false)
const editingTrack = ref<TrackInfo>({})
const isGroupEdit = ref(false)
const isDetailsEdit = ref(false)
const searchQuery = ref('')
const foundedGroups = ref<Group[]>([])
const foundedGenres = ref<Genre[]>([])
const albumRules = ref<FormRules<Album>>({
  cover: [{ required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' }]
})
const lyricsRules = ref<FormRules<TrackInfo>>({
  title: [{ required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' }],
  number: [{ required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' }],
  discNumber: [{ required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' }],
  lyrics: [{ required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' }],
  duration: [{ required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' }]
})

// Computed
const userLikedAlbum = computed((): boolean => !album.value.stats.likes.findIndex(u => u._id === store.user.id))
const isAuthenticated = computed((): boolean => store.userIsAuth)
const albumGenres = computed((): string => album.value.genres.map(g => g.name).join(', '))
const albumTotalDuration = computed((): string => {
  const totalSeconds = album.value.tracks.reduce((total, track) => {
    const [hours, minutes, seconds] = track.duration.split(':').map(i => parseInt(i))
    return total + dayjs.duration({ hours, minutes, seconds }).asSeconds()
  }, 0)

  return formatTrackDuration(totalSeconds)
})

// Methods
const removeTrack = (index: number): void => {
  album.value.tracks.splice(index, 1)
}
const showDetailsEdit = async (): Promise<void> => {
  const { data } = await store.getGenres()
  foundedGenres.value = data
  isDetailsEdit.value = !isDetailsEdit.value
}
const handleSelectGroup = (group: Group): void => {
  album.value.group = group
}
const searchGroup = async (queryString: string, cb: any): Promise<void> => {
  if (!queryString) return
  const { data } = await store.searchGroup(queryString)
  foundedGroups.value = data.groups
  cb(data.groups)
}
const getAlbumTypeLabel = (type: string): string => {
  const typeMap = {
    'full-length': 'Студийный альбом',
    ep: 'EP',
    single: 'Сингл',
    demo: 'Демо',
    live: 'Концертный альбом',
    compilation: 'Сборник',
    split: 'Сплит'
  }
  return typeMap[type] || type
}

const getAlbumTypeShortLabel = (type: string): string => {
  const typeMap = {
    'full-length': 'Альбом',
    ep: 'EP',
    single: 'Сингл',
    demo: 'Демо',
    live: 'Live',
    compilation: 'Сборник',
    split: 'Сплит'
  }
  return typeMap[type] || type
}

const getAlbumTypeTagType = (type: string): string => {
  const typeMap = {
    'full-length': 'danger',
    ep: 'warning',
    single: 'success',
    demo: 'info',
    live: 'primary',
    compilation: '',
    split: 'warning'
  }
  return typeMap[type] || 'info'
}

const formatTrackDuration = (duration: number): string => {
  return dayjs.duration(duration, 'seconds').format('HH:mm:ss')
}

const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const isTrackExpanded = (trackNumber: number): boolean => {
  return expandedTracks.value.has(trackNumber)
}

const trackHasLyrics = (track: TrackInfo) => {
  return track.lyrics !== ''
}

const toggleTrackLyrics = (track: TrackInfo): void => {
  if (!trackHasLyrics(track)) return
  if (expandedTracks.value.has(track.number)) {
    expandedTracks.value.delete(track.number)
  } else {
    expandedTracks.value.add(track.number)
  }
}

const addLyrics = (): void => {
  const lastTrackNumber = album.value.tracks.length
  editingTrack.value = { number: lastTrackNumber + 1, discNumber: 1, duration: '00:00:01' }
  showLyricsEdit.value = true
}

const editLyrics = (track: TrackInfo): void => {
  editingTrack.value = { ...track }
  showLyricsEdit.value = true
}

const handleEditClose = (): void => {
  showLyricsEdit.value = false
  editingTrack.value = {}
}

const saveAlbumInfo = async (): Promise<void> => {
  await store.updateAlbum(album.value, true)
  showAlbumInfoEdit.value = false
}
const saveLyrics = async (): Promise<void> => {
  try {
    await store.updateLyrics(album.value, editingTrack.value, true)
    showLyricsEdit.value = false
    // Update local data
    const trackIndex = album.value.tracks.findIndex(t => t.number === editingTrack.value.number)
    if (trackIndex !== -1) {
      album.value.tracks[trackIndex].lyrics = editingTrack.value.lyrics
      album.value.tracks[trackIndex].hasLyrics = !!editingTrack.value.lyrics
    }
  } catch (error) {
    ElMessage.error('Ошибка при сохранении текста')
  } finally {
    await fetchAlbumData()
  }
}

const toggleLike = async () => {
  try {
    const { newAlbum, message } = await store.toggleLike(album.value)
    ElNotification({
      type: 'success',
      message
    })
    album.value = newAlbum
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
    ElMessage.success('Ссылка скопирована в буфер обмена')
  } catch (error) {
    ElMessage.error('Ошибка при копировании ссылки')
  }
}

const addToCollection = () => {
  if (!isAuthenticated.value) {
    ElMessage.warning('Для добавления в коллекцию необходимо войти в систему')
    router.push('/login')
    return
  }
  // API call to add to collection
  ElMessage.success('Альбом добавлен в коллекцию')
}

// Fetch data
const fetchAlbumData = async () => {
  const albumId = route.params.id
  try {
    // Fetch album data
    const albumResponse = await fetch(`/eft/api/albums/${albumId}`)
    if (albumResponse.ok) {
      album.value = await albumResponse.json()
    } else {
      throw new Error('Альбом не найден')
    }

    // Fetch other albums by the same group
    if (album.value.group._id) {
      const otherResponse = await fetch(`/eft/api/groups/${album.value.group._id}/albums`)
      if (otherResponse.ok) {
        const allAlbums = await otherResponse.json()
        otherAlbums.value = allAlbums.filter(a => a._id !== albumId).slice(0, 5)
      }
    }

    // Fetch related news
    const newsResponse = await fetch(`/eft/api/news/album/${albumId}`)
    if (newsResponse.ok) {
      relatedNews.value = await newsResponse.json()
    }
  } catch (error) {
    console.error('Error fetching album data:', error)
    ElMessage.error('Ошибка загрузки данных альбома')
  }
}

watch(
  album,
  debounce(async (value: Album, oldValue): Promise<void> => {
    if (oldValue) await store.updateAlbum(value)
  }, 500),
  { deep: true }
)

onMounted(() => {
  fetchAlbumData()
})
</script>

<style scoped>
.album-page {
  min-height: 100vh;
  background: #121212;
  color: #f5f5f5;
}

/* Hero Section */
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

/* Main Content */
.album-main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  gap: 24px;
}

/* Tracklist Card */
.tracklist-card {
  background: #1e1e1e;
  border: 1px solid #333;
}

:deep(.tracklist-card .el-card__header) {
  background: #252525;
  border-bottom: 1px solid #333;
  padding: 20px;
}

.tracklist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tracklist-header h3 {
  margin: 0;
  color: #f5f5f5;
  font-size: 1.5rem;
}

.tracklist-stats {
  color: #aaa;
  font-size: 0.9rem;
}

/* Tracklist */
.tracklist {
  padding: 0;
}

.track-item {
  border-bottom: 1px solid #333;
  transition: background-color 0.3s ease;
}

.track-item:last-child {
  border-bottom: none;
}

.track-item.has-lyrics .track-main {
  cursor: pointer;
}

.track-item.has-lyrics .track-main:hover {
  background: #252525;
}

.track-main {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 16px;
  transition: background-color 0.2s ease;
}

.track-number {
  width: 30px;
  text-align: center;
  color: #9e2a2a;
  font-weight: bold;
  font-size: 1rem;
  flex-shrink: 0;
}

.track-info {
  flex: 1;
}

.track-title {
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 4px 0;
  color: #f5f5f5;
}

.track-meta {
  display: flex;
  gap: 12px;
  align-items: center;
}

.track-duration {
  color: #aaa;
  font-size: 0.85rem;
}

.lyrics-tag {
  font-size: 0.7rem;
}

.track-actions {
  flex-shrink: 0;
}

/* Lyrics Section */
.track-lyrics {
  background: #252525;
  border-top: 1px solid #333;
}

.lyrics-content {
  padding: 10px;
  padding-left: 22px; /* align with track content */
}

.lyrics-content h5 {
  color: #f5f5f5;
  margin: 0 0 12px 0;
  font-size: 1rem;
}

.lyrics-text {
  color: #e0e0e0;
  font-family: inherit;
  font-size: 0.95rem;
  line-height: 1.5;
  white-space: pre-wrap;
  margin: 0 0 16px 0;
  background: #2a2a2a;
  padding: 16px;
  border-radius: 6px;
  border-left: 3px solid #9e2a2a;
}

.lyrics-actions {
  border-top: 1px solid #333;
  padding-top: 12px;
}

/* Description Card */
.description-card {
  background: #1e1e1e;
  border: 1px solid #333;
  margin-bottom: 24px;
}

:deep(.description-card .el-card__header) {
  background: #252525;
  border-bottom: 1px solid #333;
  padding: 20px;
}

:deep(.description-card .el-card__header h3) {
  margin: 0;
  color: #f5f5f5;
}

.description-content {
  color: #e0e0e0;
  line-height: 1.6;
}

/* Sidebar */
.sidebar-section {
  background: #1e1e1e;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid #333;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #f5f5f5;
  margin: 0;
}

/* Group Info */
.group-info-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #252525;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.group-info-card:hover {
  background: #2a2a2a;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.group-logo {
  flex-shrink: 0;
}

.group-info {
  flex: 1;
}

.group-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #f5f5f5;
}

.group-country {
  color: #aaa;
  font-size: 0.9rem;
  margin: 0 0 8px 0;
}

.group-genres {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

/* Details List */
.details-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #333;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  color: #aaa;
  font-size: 0.9rem;
}

.detail-value {
  font-size: 0.9rem;
  font-weight: 500;
  text-align: right;
  min-width: 180px;
}

/* Other Albums */
.other-albums {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.other-album-item {
  display: flex;
  align-items: center;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.other-album-item:hover {
  background: #252525;
}

.album-cover {
  position: relative;
  overflow: hidden;
  max-width: 300px;
}

.album-info {
  flex: 1;
  padding: 16px;
}

.album-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 2px 0;
  color: #f5f5f5;
}

.album-year-type {
  font-size: 0.8rem;
  color: #aaa;
  margin: 0 0 4px 0;
}

.album-stats .stat {
  font-size: 0.7rem;
  color: #777;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Related News */
.related-news {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.news-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.news-item:hover {
  background: #252525;
}

.news-image {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
}

.news-image .el-image {
  width: 100%;
  height: 100%;
}

.image-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #333;
  color: #666;
  font-size: 20px;
}

.news-content {
  flex: 1;
}

.news-title {
  font-size: 0.85rem;
  font-weight: 500;
  margin: 0 0 4px 0;
  color: #f5f5f5;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-date {
  font-size: 0.75rem;
  color: #777;
  margin: 0;
}

/* Loading State */
.loading-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Responsive Design */
@media (max-width: 992px) {
  .hero-container {
    flex-direction: column;
    text-align: center;
    gap: 30px;
  }

  .album-cover {
    width: 250px;
    height: 250px;
  }

  .album-title {
    font-size: 2.5rem;
  }

  .album-artist {
    justify-content: center;
  }

  .album-meta {
    justify-content: center;
  }

  .album-stats {
    justify-content: center;
  }

  .album-actions {
    justify-content: center;
  }

  .lyrics-content {
    padding-left: 20px;
  }
}

@media (max-width: 768px) {
  .album-hero {
    padding: 40px 0;
  }

  .album-title {
    font-size: 2rem;
  }

  .album-meta {
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }

  .tracklist-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .track-main {
    padding: 12px 16px;
  }

  .track-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>
