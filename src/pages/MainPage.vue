<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <el-carousel height="500px" :interval="5000" indicator-position="outside" arrow="always">
        <el-carousel-item v-for="(slide, index) in heroSlides" :key="index">
          <div
            class="hero-slide"
            :style="{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${slide.image})`
            }"
          >
            <div class="hero-content">
              <el-tag v-if="slide.category" type="danger" size="large">
                {{ slide.category }}
              </el-tag>
              <h1 class="hero-title">{{ slide.title }}</h1>
              <p class="hero-description">{{ slide.description }}</p>
              <el-button type="danger" size="large" @click="$router.push(slide.link)">Узнать больше</el-button>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </section>

    <!-- Main Content -->
    <el-container class="main-content" :gutter="20">
      <!-- Left Column - News -->
      <el-col :xs="24" :md="16" class="left-column">
        <!-- News Section -->
        <section class="news-section">
          <div class="section-header">
            <h2 class="section-title">
              <i class="el-icon-news"></i>
              Последние новости
            </h2>
            <el-button type="text" @click="$router.push('/news')" class="view-all-btn">
              Все новости
              <i class="el-icon-arrow-right"></i>
            </el-button>
          </div>

          <div class="news-grid">
            <el-card
              v-for="news in latestNews"
              :key="news._id"
              class="news-card"
              shadow="hover"
              @click="$router.push(`/news/${news._id}`)"
            >
              <div class="news-image">
                <el-image
                  :src="news.featuredImage || '/images/news-placeholder.jpg'"
                  :alt="news.title"
                  fit="cover"
                  class="image"
                >
                  <template #error>
                    <div class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </template>
                </el-image>
                <el-tag v-if="news.category" :type="getCategoryTagType(news.category)" class="news-category">
                  {{ getCategoryLabel(news.category) }}
                </el-tag>
              </div>

              <div class="news-content">
                <h3 class="news-title">{{ news.title }}</h3>
                <p class="news-excerpt">{{ news.excerpt }}</p>

                <div class="news-meta">
                  <div class="meta-left">
                    <span class="news-date">
                      <i class="el-icon-time"></i>
                      {{ formatDate(news.publishedAt) }}
                    </span>
                    <span class="news-views">
                      <i class="el-icon-view"></i>
                      {{ news.views }}
                    </span>
                  </div>
                  <div class="meta-right">
                    <el-button type="text" size="small" @click.stop="$router.push(`/news/${news._id}`)">
                      Читать
                    </el-button>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </section>
      </el-col>

      <!-- Right Column - Sidebar -->
      <el-col :xs="24" :md="8" class="right-column">
        <!-- Latest Groups -->
        <section class="sidebar-section">
          <div class="section-header">
            <h3 class="section-title">
              <i class="el-icon-star"></i>
              Новые группы
            </h3>
            <el-button type="text" size="small" @click="$router.push('/groups')">Все</el-button>
          </div>

          <div class="groups-list">
            <div
              v-for="group in latestGroups"
              :key="group._id"
              class="group-item"
              @click="$router.push(`/groups/${group._id}`)"
            >
              <div class="group-logo">
                <el-avatar :size="50" :src="group.logo" :alt="group.name" shape="square">
                  <i class="el-icon-headset" v-if="!group.logo"></i>
                </el-avatar>
              </div>
              <div class="group-info">
                <h4 class="group-name">{{ group.name }}</h4>
                <div class="group-meta">
                  <span class="group-country">
                    <el-icon>
                      <Location />
                    </el-icon>
                    {{ group.country }}
                  </span>
                  <span class="group-year">
                    <el-icon>
                      <Calendar />
                    </el-icon>
                    {{ group.formedYear }}
                  </span>
                </div>
                <div class="group-genres">
                  <el-tag
                    v-for="genre in group.genres.slice(0, 2)"
                    :key="genre._id"
                    size="small"
                    effect="plain"
                    style="padding: 0"
                  >
                    {{ genre.name }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Top Albums -->
        <section class="sidebar-section">
          <div class="section-header">
            <h3 class="section-title">
              <i class="el-icon-trophy"></i>
              Топ альбомов
            </h3>
          </div>

          <div class="albums-list">
            <div
              v-for="(album, index) in topAlbums"
              :key="album._id"
              class="album-item"
              @click="$router.push(`/albums/${album._id}`)"
            >
              <div class="album-rank">
                <span class="rank-number">{{ index + 1 }}</span>
              </div>
              <div class="album-cover">
                <el-avatar :size="50" :src="album.cover" :alt="album.title" shape="square">
                  <i class="el-icon-picture" v-if="!album.cover"></i>
                </el-avatar>
              </div>
              <div class="album-info">
                <h5 class="album-title">{{ album.title }}</h5>
                <p class="album-artist">{{ album.group.name }}</p>
                <div class="album-rating">
                  <el-rate
                    v-model="album.rating"
                    disabled
                    show-score
                    text-color="#ff9900"
                    score-template="{value}"
                    class="rating-stars"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Quick Stats -->
        <section class="sidebar-section">
          <div class="section-header">
            <h3 class="section-title">
              <i class="el-icon-data-line"></i>
              Статистика
            </h3>
          </div>

          <div class="stats-grid">
            <el-card shadow="never" class="stat-card">
              <div class="stat-content">
                <div class="stat-icon groups">
                  <i class="el-icon-headset"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ stats.totalGroups }}</div>
                  <div class="stat-label">Групп</div>
                </div>
              </div>
            </el-card>

            <el-card shadow="never" class="stat-card">
              <div class="stat-content">
                <div class="stat-icon albums">
                  <i class="el-icon-disc"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ stats.totalAlbums }}</div>
                  <div class="stat-label">Альбомов</div>
                </div>
              </div>
            </el-card>

            <el-card shadow="never" class="stat-card">
              <div class="stat-content">
                <div class="stat-icon news">
                  <i class="el-icon-document"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ stats.totalNews }}</div>
                  <div class="stat-label">Новостей</div>
                </div>
              </div>
            </el-card>

            <el-card shadow="never" class="stat-card">
              <div class="stat-content">
                <div class="stat-icon users">
                  <i class="el-icon-user"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ stats.totalUsers }}</div>
                  <div class="stat-label">Пользователей</div>
                </div>
              </div>
            </el-card>
          </div>
        </section>
      </el-col>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Calendar, Location } from '@element-plus/icons-vue'

import { api } from '@/services/api'

const router = useRouter()

// Hero slides data
const heroSlides = ref([
  {
    title: 'Новый альбом Rammstein уже скоро!',
    description: 'Легендарная немецкая группа анонсировала выход нового студийного альбома осенью 2024 года',
    image: '',
    category: 'Анонс',
    link: '/news/1'
  },
  {
    title: 'Metal Festival 2024',
    description: 'Крупнейший метал-фестиваль года объявил полный лайнап выступлений',
    image: '',
    category: 'Событие',
    link: '/news/2'
  },
  {
    title: 'Интервью с Architects',
    description: 'Эксклюзивное интервью с участниками британской металкор-группы',
    image: '',
    category: 'Интервью',
    link: '/news/3'
  }
])

// Latest news
const latestNews = ref([])

// Latest groups
const latestGroups = ref([])

// Top albums
const topAlbums = ref([])

// Featured genres
const featuredGenres = ref([])

// Statistics
const stats = ref({
  totalGroups: 0,
  totalAlbums: 0,
  totalNews: 0,
  totalUsers: 0
})

// Format date
const formatDate = dateString => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Get category tag type
const getCategoryTagType = category => {
  const types = {
    news: 'primary',
    review: 'success',
    interview: 'warning',
    release: 'danger'
  }
  return types[category] || 'info'
}

// Get category label
const getCategoryLabel = category => {
  const labels = {
    news: 'Новость',
    review: 'Обзор',
    interview: 'Интервью',
    release: 'Релиз'
  }
  return labels[category] || category
}

// Fetch data
const fetchHomeData = async () => {
  try {
    // Fetch latest news
    const newsResponse = await api.get('/news/latest?limit=6')
    if (newsResponse.data) {
      latestNews.value = newsResponse.data
    }

    // Fetch latest groups
    const groupsResponse = await api.get('/groups/latest?limit=5')
    if (groupsResponse.data) {
      latestGroups.value = groupsResponse.data
    }

    // Fetch top albums
    const albumsResponse = await api.get('/albums/top?limit=5')
    if (albumsResponse.data) {
      topAlbums.value = albumsResponse.data
    }

    // Fetch featured genres
    const genresResponse = await api.get('/genres/popular?limit=6')
    if (genresResponse.data) {
      featuredGenres.value = genresResponse.data
    }

    // Fetch statistics
    const statsResponse = await api.get('/stats')
    if (statsResponse.data) {
      stats.value = statsResponse.data
    }
  } catch (error) {
    console.error('Error fetching home data:', error)
    ElMessage.error('Ошибка загрузки данных')
  }
}

onMounted(() => {
  fetchHomeData()
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #121212;
  color: #f5f5f5;
}

/* Hero Section */
.hero-section {
  margin-bottom: 40px;
}

.hero-slide {
  height: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  padding: 0 20px;
}

.hero-title {
  font-size: 3rem;
  font-weight: bold;
  margin: 20px 0;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.hero-description {
  font-size: 1.2rem;
  margin-bottom: 30px;
  color: #e0e0e0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

/* Main Content */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  gap: 25px;
}

/* Section Headers */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.5rem;
  font-weight: 600;
  color: #f5f5f5;
  margin: 0;
}

.view-all-btn {
  color: #9e2a2a;
  font-weight: 500;
}

/* News Section */
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 15px;
}

.news-card {
  background: #1e1e1e;
  border: 1px solid #333;
  cursor: pointer;
  transition: all 0.3s ease;
}

.news-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  border-color: #9e2a2a;
}

.news-image {
  position: relative;
  height: 200px;
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
  background: #252525;
  color: #666;
  font-size: 24px;
}

.news-category {
  position: absolute;
  top: 12px;
  left: 12px;
}

.news-content {
  padding: 16px;
}

.news-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #f5f5f5;
  line-height: 1.4;
}

.news-excerpt {
  color: #aaa;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #777;
}

.meta-left {
  display: flex;
  gap: 16px;
}

.meta-left span {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Sidebar Sections */
.sidebar-section {
  background: #1e1e1e;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid #333;
}

/* Groups List */
.groups-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.group-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.group-item:hover {
  background: #252525;
}

.group-info {
  flex: 1;
}

.group-name {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #f5f5f5;
}

.group-meta {
  display: flex;
  gap: 12px;
  font-size: 0.8rem;
  color: #aaa;
  margin-bottom: 6px;
}

.group-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.group-genres {
  display: flex;
  gap: 4px;
}

/* Albums List */
.albums-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.album-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.album-item:hover {
  background: #252525;
}

.album-rank {
  width: 24px;
  text-align: center;
}

.rank-number {
  display: inline-block;
  width: 24px;
  height: 24px;
  background: #9e2a2a;
  color: white;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  line-height: 24px;
  text-align: center;
}

.album-info {
  flex: 1;
}

.album-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 2px 0;
  color: #f5f5f5;
}

.album-artist {
  font-size: 0.8rem;
  color: #aaa;
  margin: 0 0 4px 0;
}

.rating-stars {
  font-size: 0.7rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.stat-card {
  background: #252525;
  border: 1px solid #333;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-icon.groups {
  background: #9e2a2a;
  color: white;
}
.stat-icon.albums {
  background: #b38b3b;
  color: white;
}
.stat-icon.news {
  background: #2a9e5e;
  color: white;
}
.stat-icon.users {
  background: #2a5c9e;
  color: white;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #f5f5f5;
}

.stat-label {
  font-size: 0.8rem;
  color: #aaa;
}

/* Genres Section */
.genres-section {
  background: #1a1a1a;
  padding: 60px 0;
  margin-top: 40px;
}

.genres-section .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.genres-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.genre-card {
  background: #252525;
  border: 1px solid #333;
  cursor: pointer;
  transition: all 0.3s ease;
}

.genre-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  border-color: #9e2a2a;
}

.genre-content {
  padding: 20px;
}

.genre-name {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #f5f5f5;
}

.genre-description {
  color: #aaa;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.genre-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.genre-groups {
  font-size: 0.8rem;
  color: #777;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .news-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .genres-grid {
    grid-template-columns: 1fr;
  }
}

/* Custom Element Plus theme overrides */
:deep(.el-carousel__arrow) {
  background: rgba(158, 42, 42, 0.8);
}

:deep(.el-carousel__arrow:hover) {
  background: #9e2a2a;
}

:deep(.el-carousel__indicator button) {
  background: #666;
}

:deep(.el-carousel__indicator.is-active button) {
  background: #9e2a2a;
}

:deep(.el-card) {
  background: #1e1e1e;
  border: 1px solid #333;
}

:deep(.el-card__body) {
  padding: 0;
}

:deep(.el-button--danger) {
  background: #9e2a2a;
  border-color: #9e2a2a;
}

:deep(.el-button--danger:hover) {
  background: #b33c3c;
  border-color: #b33c3c;
}

:deep(.el-tag) {
  border: none;
}

:deep(.el-rate) {
  --el-rate-font-size: 12px;
}
</style>
