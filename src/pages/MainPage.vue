<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <el-carousel height="500px" :interval="5000" indicator-position="outside" arrow="always">
        <el-carousel-item v-for="(news, index) in latestNews" :key="index">
          <div
            class="hero-slide"
            :style="{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${news.featuredImage})`
            }"
          >
            <div class="hero-content">
              <h1 class="hero-title">{{ news.title }}</h1>
              <p class="hero-description">{{ news.content }}</p>
              <el-button type="danger" size="large" @click="$router.push(`/news/${news._id}`)">Узнать больше</el-button>
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
              <SvgIcon type="mdi" :path="mdiNewspaper" :size="18" />
              Последние новости
            </h2>
            <el-button type="text" @click="$router.push('/news')" class="view-all-btn">
              Все новости
              <el-icon><ArrowRight /></el-icon>
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
                      <el-icon><Picture /></el-icon>
                    </div>
                  </template>
                </el-image>
                <el-tag v-if="news.category" :type="getCategoryTagType(news.category)" class="news-category">
                  {{ getCategoryLabel(news.category) }}
                </el-tag>
              </div>

              <div class="news-content">
                <h3 class="news-title">{{ news.title }}</h3>

                <div class="news-meta">
                  <div class="meta-left">
                    <span class="news-date">
                      <el-icon><Clock /></el-icon>
                      {{ formatDate(news.publishedAt) }}
                    </span>
                    <span class="news-views">
                      <el-icon><View /></el-icon>
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
              <el-icon><Star /></el-icon>
              Новые группы
            </h3>
          </div>

          <div class="groups-list">
            <div
              v-for="group in latestGroups"
              :key="group._id"
              class="group-item"
              @click="$router.push(`/group/${group._id}`)"
            >
              <el-avatar class="group-logo" :size="50" :src="group.logo" :alt="group.name" shape="square">
                <el-icon v-if="!group.logo"><Headset /></el-icon>
              </el-avatar>
              <div class="group-info">
                <h4 class="group-name">{{ group.name }}</h4>
                <div class="group-meta">
                  <span class="group-country">
                    <el-icon>
                      <Location />
                    </el-icon>
                    {{ group.country.join(', ') }}
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

        <!-- Quick Stats -->
        <section class="sidebar-section">
          <div class="section-header">
            <h3 class="section-title">
              <el-icon><DataLine /></el-icon>
              Статистика
            </h3>
          </div>

          <div class="stats-grid">
            <el-card shadow="never" class="stat-card">
              <div class="stat-content">
                <div class="stat-icon groups">
                  <el-icon><Headset /></el-icon>
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
                  <SvgIcon type="mdi" :path="mdiAlbum" :size="18" />
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
                  <el-icon><Document /></el-icon>
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
                  <el-icon><User /></el-icon>
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

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Calendar,
  Location,
  ArrowRight,
  Picture,
  Clock,
  View,
  Star,
  Headset,
  Trophy,
  DataLine,
  Document,
  User
} from '@element-plus/icons-vue'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiAlbum, mdiNewspaper } from '@mdi/js'

import { api } from '@/services/api'

import type { Album, Genre, Group, News } from '@/types'

// Latest news
const latestNews = ref<News[]>([])

// Latest groups
const latestGroups = ref<Group[]>([])

// Top albums
const topAlbums = ref<Album[]>([])

// Featured genres
const featuredGenres = ref<Genre[]>([])

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
    const groupsResponse = await api.get('/group/latest?limit=5')
    if (groupsResponse.data) {
      latestGroups.value = groupsResponse.data
    }

    // Fetch top albums
    const albumsResponse = await api.get('/album/top?limit=5')
    if (albumsResponse.data) {
      topAlbums.value = albumsResponse.data
    }

    // Fetch featured genres
    const genresResponse = await api.get('/genre/popular?limit=6')
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
.group-logo {
  border: 1px solid #fff;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
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
  padding: 10px;
  margin: 10px;
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
