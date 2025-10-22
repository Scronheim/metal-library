<template>
  <div class="group-page" v-if="group">
    <!-- Hero Section with Group Banner -->
    <section class="group-hero">
      <div
        class="hero-banner"
        :style="{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${group.banner})`
        }"
      >
        <div class="hero-content">
          <div class="group-basic-info">
            <div class="group-logo-section">
              <el-avatar :size="120" :src="group.logo" :alt="group.name" shape="square" class="group-logo">
                <el-icon v-if="!group.logo">
                  <Headset />
                </el-icon>
              </el-avatar>
            </div>
            <div class="group-info-main">
              <h1 class="group-name">{{ group.name }}</h1>
              <div class="group-meta">
                <div class="meta-item">
                  <el-icon>
                    <Location />
                  </el-icon>
                  <span>{{ group.country }}</span>
                  <span v-if="group.city">, {{ group.city }}</span>
                </div>
                <div class="meta-item">
                  <el-icon>
                    <Clock />
                  </el-icon>
                  <span>Основана в {{ group.formedYear }}</span>
                </div>
                <div class="meta-item">
                  <span>{{ store.statusTypesMap[group.status] }}</span>
                </div>
              </div>
              <div class="group-genres">
                <el-tag
                  v-for="genre in group.genres"
                  :key="genre._id"
                  type="danger"
                  effect="dark"
                  class="genre-tag"
                  @click="$router.push(`/genres/${genre._id}`)"
                >
                  {{ genre.name }}
                </el-tag>
              </div>
              <div class="group-actions">
                <el-button type="danger" :icon="Star" @click="toggleLike">
                  {{ group.stats.likes.length }}
                </el-button>
                <el-button type="primary" :icon="Share" @click="shareGroup">Поделиться</el-button>
                <el-button v-if="store.userIsAuth" type="success" :icon="Plus" @click="addToFavorites">
                  В избранное
                </el-button>
                <el-button v-if="store.userIsAdmin" type="info" :icon="Edit" @click="openGroupInfoDialog">
                  Редактировать
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <el-container class="group-main-content">
      <!-- Left Column - Group Info -->
      <el-col :xs="24" :lg="16" class="left-column">
        <!-- Tabs Navigation -->
        <el-tabs v-model="activeTab" class="group-tabs">
          <!-- Biography Tab -->
          <el-tab-pane label="Биография" name="biography">
            <el-card>
              <div class="biography-content">
                <div class="flex items-center gap-3 mb-3">
                  <h3>О группе</h3>
                  <EditIconButton v-if="store.userIsAdmin" @click="showGroupBioDialog = true" />
                </div>
                <div class="description-text" v-html="formatDescription(group.description)"></div>

                <!-- Themes -->
                <div class="themes-section" v-if="group.themes && group.themes.length">
                  <h4>Тематика</h4>
                  <div class="themes-list">
                    <el-tag v-for="theme in group.themes" :key="theme" effect="plain" class="theme-tag">
                      {{ theme }}
                    </el-tag>
                  </div>
                </div>

                <!-- Social Links -->
                <div class="social-links" v-if="group.socialLinks && group.socialLinks.length">
                  <h4>Ссылки</h4>
                  <div class="social-buttons">
                    <el-button
                      v-for="link in group.socialLinks"
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
            </el-card>
          </el-tab-pane>

          <!-- Discography Tab -->
          <el-tab-pane label="Дискография" name="discography">
            <el-card>
              <!-- Discography Header with Stats -->
              <div class="discography-header">
                <div class="flex items-center gap-3">
                  <h3>Дискография</h3>
                  <AddIconButton v-if="store.userIsAdmin" @click="openAlbumAddDialog" />
                </div>
                <div class="discography-stats">
                  <span class="stat">
                    <i class="el-icon-disc"></i>
                    Всего альбомов: {{ albums.length }}
                  </span>
                  <span class="stat">
                    <i class="el-icon-time"></i>
                    Период: {{ getDiscographyPeriod }}
                  </span>
                </div>
              </div>

              <!-- Albums Grid -->
              <div class="albums-grid" v-if="sortedAlbums.length">
                <el-card
                  v-for="album in sortedAlbums"
                  :key="album._id"
                  class="album-card"
                  shadow="hover"
                  @click="$router.push(`/albums/${album._id}`)"
                >
                  <div class="album-cover">
                    <el-image :src="album.cover" :alt="album.title" fit="cover" class="cover-image" />
                    <el-tag v-if="album.type" :type="store.albumTypeColorMap[album.type]" class="album-type-tag">
                      {{ store.albumTypesMap[album.type] }}
                    </el-tag>
                  </div>
                  <div class="album-info">
                    <h4 class="album-title">{{ album.title }}</h4>
                    <p class="album-year">{{ new Date(album.releaseDate).getFullYear() }}</p>
                    <p class="album-label" v-if="album.label">{{ album.label }}</p>
                    <div class="album-meta">
                      <span class="tracks-count" v-if="album.tracks">
                        <el-icon>
                          <Headset />
                        </el-icon>
                        {{ album.tracks.length }} треков
                      </span>
                    </div>
                    <div class="album-stats">
                      <span class="stat">
                        <el-icon>
                          <View />
                        </el-icon>
                        {{ album.stats.views }}
                      </span>
                      <span class="stat">
                        <el-icon>
                          <Star />
                        </el-icon>
                        {{ album.stats.likes.length }}
                      </span>
                    </div>
                  </div>
                </el-card>
              </div>

              <el-empty v-else description="Альбомы не добавлены" class="empty-albums" />
            </el-card>
          </el-tab-pane>

          <!-- Members Tab -->
          <el-tab-pane label="Участники" name="members">
            <el-card>
              <!-- Current Members -->
              <div class="members-section">
                <h3>
                  Текущий состав
                  <AddIconButton
                    v-if="store.userIsAdmin"
                    title="Добавить участника"
                    :is-close-edit="showNewMemberInput"
                    @click="toggleNewMemberInput"
                  />
                </h3>
                <NewMemberAddForm
                  v-if="showNewMemberInput"
                  :member="editableMember"
                  @open-add-member-dialog="openAddMemberDialog"
                  @add-member-to-group="addMemberToGroup"
                />
                <div class="members-grid">
                  <MemberCard
                    v-for="(member, index) in group.currentMembers"
                    :member="member.member"
                    @remove-member="removeCurrentMember(index)"
                    @open-edit-member-dialog="openEditMemberDialog(member.member)"
                  />
                </div>
              </div>

              <!-- Past Members -->
              <div class="members-section">
                <h3>
                  Бывшие участники
                  <AddIconButton
                    v-if="store.userIsAdmin"
                    title="Добавить участника"
                    :is-close-edit="showPastMemberInput"
                    @click="togglePastMemberInput"
                  />
                </h3>
                <NewMemberAddForm
                  v-if="showPastMemberInput"
                  :member="editableMember"
                  @open-add-member-dialog="openAddMemberDialog"
                  @add-member-to-group="addMemberToGroup"
                />
                <div class="members-grid">
                  <MemberCard
                    v-for="(member, index) in group.pastMembers"
                    :member="member.member"
                    @remove-member="removePastMember(index)"
                    @open-edit-member-dialog="openEditMemberDialog(member.member)"
                  />
                </div>
              </div>
            </el-card>
          </el-tab-pane>

          <!-- Similar Groups Tab -->
          <el-tab-pane label="Похожие группы" name="similar">
            <el-card>
              <div class="similar-groups-content">
                <div class="similar-groups-grid" v-if="similarGroups.length">
                  <el-card
                    v-for="similarGroup in similarGroups"
                    :key="similarGroup._id"
                    class="similar-group-card"
                    shadow="hover"
                    @click="$router.push(`/groups/${similarGroup._id}`)"
                  >
                    <div class="similar-group-content">
                      <el-avatar
                        :size="60"
                        :src="similarGroup.logo"
                        :alt="similarGroup.name"
                        shape="square"
                        class="group-logo"
                      >
                        <i class="el-icon-headset" v-if="!similarGroup.logo"></i>
                      </el-avatar>
                      <div class="similar-group-info">
                        <h4 class="group-name">{{ similarGroup.name }}</h4>
                        <p class="group-country">{{ similarGroup.country }}</p>
                        <div class="group-genres">
                          <el-tag
                            v-for="genre in similarGroup.genres.slice(0, 2)"
                            :key="genre._id"
                            size="small"
                            effect="plain"
                          >
                            {{ genre.name }}
                          </el-tag>
                        </div>
                      </div>
                    </div>
                  </el-card>
                </div>
                <el-empty v-else description="Похожие группы не найдены" class="empty-similar" />
              </div>
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </el-col>

      <!-- Right Column - Sidebar -->
      <el-col :xs="24" :lg="8" class="right-column">
        <!-- Group Stats -->
        <section class="sidebar-section">
          <div class="section-header">
            <h3 class="section-title">
              <i class="el-icon-data-line"></i>
              Статистика
            </h3>
          </div>
          <div class="stats-cards">
            <el-card shadow="never" class="stat-card">
              <div class="stat-content">
                <div class="stat-icon views">
                  <el-icon>
                    <View />
                  </el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ group.stats.views }}</div>
                  <div class="stat-label">Просмотров</div>
                </div>
              </div>
            </el-card>

            <el-card shadow="never" class="stat-card">
              <div class="stat-content">
                <div class="stat-icon likes">
                  <el-icon>
                    <Star />
                  </el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ group.stats.likes.length }}</div>
                  <div class="stat-label">Лайков</div>
                </div>
              </div>
            </el-card>

            <el-card shadow="never" class="stat-card">
              <div class="stat-content">
                <div class="stat-icon albums">
                  <el-icon>
                    <Microphone />
                  </el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ albums.length }}</div>
                  <div class="stat-label">Альбомов</div>
                </div>
              </div>
            </el-card>

            <el-card shadow="never" class="stat-card">
              <div class="stat-content">
                <div class="stat-icon members">
                  <el-icon>
                    <User />
                  </el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ totalMembers }}</div>
                  <div class="stat-label">Участников</div>
                </div>
              </div>
            </el-card>
          </div>
        </section>

        <!-- Latest Albums -->
        <section class="sidebar-section">
          <div class="section-header">
            <h3 class="section-title">
              <i class="el-icon-trophy"></i>
              Последние альбомы
            </h3>
          </div>
          <div class="latest-albums grid grid-cols-1">
            <div
              v-for="album in latestAlbums"
              :key="album._id"
              class="album-item"
              @click="$router.push(`/albums/${album._id}`)"
            >
              <div class="album-cover">
                <el-avatar :size="50" :src="album.cover" :alt="album.title" shape="square">
                  <i class="el-icon-disc" v-if="!album.cover"></i>
                </el-avatar>
              </div>
              <div class="album-info">
                <h5 class="album-title">{{ album.title }}</h5>
                <p class="album-year-type">
                  {{ new Date(album.releaseDate).getFullYear() }}
                </p>
                <div class="album-stats">
                  <span class="stat">
                    <el-icon>
                      <View />
                    </el-icon>
                    {{ album.stats.views }}
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
              Новости о группе
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
                      <el-icon>
                        <Picture />
                      </el-icon>
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

  <el-dialog v-model="showGroupInfoDialog" title="Редактирование информации о группе" top="10px" width="750px">
    <el-form ref="groupRef" :model="group" :rules="groupInfoRules" label-position="top">
      <el-card header="Основная информация" class="mb-2">
        <div class="flex gap-2">
          <el-form-item label="Страна" prop="country">
            <el-select v-model="group.country" placeholder="Выберите страну" filterable value-key="name">
              <el-option
                v-for="country in store.countries"
                :key="country.alpha2"
                :label="country.name"
                :value="country"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Город" prop="city">
            <el-input v-model="group.city" placeholder="Введите название города" />
          </el-form-item>
          <el-form-item label="Год образования" prop="formedYear">
            <el-select v-model.number="group.formedYear" placeholder="Выберите год" filterable style="width: 130px">
              <el-option v-for="year in store.availableYears" :key="year" :label="year" :value="year" />
            </el-select>
          </el-form-item>
          <el-form-item label="Статус" prop="status">
            <el-select v-model.number="group.status" placeholder="Выберите статус" style="width: 130px">
              <el-option v-for="(value, key) in store.statusTypesMap" :key="key" :label="value" :value="key" />
            </el-select>
          </el-form-item>
        </div>
      </el-card>
      <el-card header="Жанры и тематика" class="mb-2">
        <div class="flex gap-3">
          <el-form-item label="Жанры" prop="genres">
            <el-select
              v-model="group.genres"
              placeholder="Выберите жанр"
              filterable
              multiple
              collapse-tags
              collapse-tags-tooltip
              :max-collapse-tags="2"
              value-key="name"
            >
              <el-option v-for="genre in store.availableGenres" :key="genre._id" :label="genre.name" :value="genre" />
            </el-select>
          </el-form-item>
          <el-form-item label="Тематики текстов" prop="themes">
            <el-select
              v-model="group.themes"
              placeholder="Введите тематику"
              multiple
              filterable
              allow-create
              default-first-option
              :reserve-keyword="false"
            >
              <el-option v-for="theme in group.themes" :key="theme" :label="theme" :value="theme" />
            </el-select>
          </el-form-item>
        </div>
      </el-card>
      <el-card header="Изображения">
        <div class="flex gap-2">
          <el-form-item prop="logo">
            <template #label>
              Ссылка на логотип
              <el-tooltip class="box-item" effect="dark" content="Найти в Яндексе" placement="top">
                <el-button :icon="Search" size="small" circle @click="openYandexSearch" />
              </el-tooltip>
            </template>
            <el-input v-model="group.logo" placeholder="Введите ссылку на логотип" />
            <el-image :src="group.logo">
              <template #error>
                <div class="cover-placeholder">
                  <SvgIcon type="mdi" :path="mdiAlbum" :size="18" />
                </div>
              </template>
            </el-image>
          </el-form-item>
          <el-form-item prop="banner">
            <template #label>
              Ссылка на баннер
              <el-tooltip class="box-item" effect="dark" content="Найти в Яндексе" placement="top">
                <el-button :icon="Search" size="small" circle @click="openYandexSearch(false)" />
              </el-tooltip>
            </template>
            <el-input v-model="group.banner" placeholder="Введите ссылку на баннер" />
            <el-image :src="group.banner">
              <template #error>
                <div class="cover-placeholder">
                  <SvgIcon type="mdi" :path="mdiAlbum" :size="18" />
                </div>
              </template>
            </el-image>
          </el-form-item>
        </div>
      </el-card>
    </el-form>

    <template #footer>
      <el-button @click="showGroupInfoDialog = false">Отмена</el-button>
      <el-button type="success" @click="saveGroupInfo">Сохранить</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="showGroupBioDialog" title="Редактирование биографии группы" width="600px">
    <el-form :model="group" :rules="groupInfoRules" label-position="top">
      <el-card header="О группе" class="mb-2">
        <el-form-item prop="description">
          <el-input type="textarea" :rows="10" v-model="group.description" placeholder="Введите описание" />
        </el-form-item>
      </el-card>
      <el-card header="Тематики треков" class="mb-2">
        <el-select
          v-model="group.themes"
          placeholder="Введите тематику"
          multiple
          filterable
          allow-create
          default-first-option
          :reserve-keyword="false"
        >
          <el-option v-for="theme in group.themes" :key="theme" :label="theme" :value="theme" />
        </el-select>
      </el-card>
      <el-card>
        <template #header>
          Соц. сети
          <AddIconButton @click="addSocialLink" />
        </template>
        <el-form-item prop="socialLinks">
          <div v-for="(link, index) in group.socialLinks" :key="link.url" class="flex items-center gap-3 mb-2">
            <el-select v-model="link.platform" placeholder="Платформа" style="width: 200px">
              <el-option
                v-for="(value, key) in store.socialPlatformNamesMap"
                :key="value"
                :label="value"
                :value="key"
              />
            </el-select>
            <el-input v-model="link.url" placeholder="Введите URL" />
            <DeleteIconButton @confirm="removeSocialLink(index)" />
          </div>
        </el-form-item>
      </el-card>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="showGroupBioDialog = false">Закрыть</el-button>
        <el-button type="success" @click="saveGroupInfo">Сохранить</el-button>
      </div>
    </template>
  </el-dialog>

  <EditAlbumDialog v-model="showEditableAlbumDialog" mode="add" :group="group" @success="fetchGroupData" />
  <MemberFormDialog
    v-model="showMemberDialog"
    :mode="memberMode"
    :member="editableMember"
    @add="addMemberToGroup"
    @update="updateMember"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElNotification, type FormRules } from 'element-plus'
import {
  Star,
  Share,
  Plus,
  Headset,
  View,
  Microphone,
  User,
  Location,
  Clock,
  Edit,
  Search,
  Picture
} from '@element-plus/icons-vue'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiAlbum } from '@mdi/js'

import { useStore } from '@/stores/store'

import { getDefaultGroup, getDefaultMember } from '@/consts'

import EditIconButton from '@/components/buttons/EditIconButton.vue'
import AddIconButton from '@/components/buttons/AddIconButton.vue'
import DeleteIconButton from '@/components/buttons/DeleteIconButton.vue'
import EditAlbumDialog from '@/components/dialogs/EditAlbumDialog.vue'

import type { Album, Group, Member, News } from '@/types'
import MemberFormDialog from '@/components/dialogs/MemberFormDialog.vue'
import NewMemberAddForm from '@/components/forms/NewMemberAddForm.vue'
import MemberCard from '@/components/forms/MemberCard.vue'

const route = useRoute()
const store = useStore()

// Refs
const group = ref<Group>(getDefaultGroup())
const albums = ref<Album[]>([])
const similarGroups = ref<Group[]>([])
const relatedNews = ref<News[]>([])
const activeTab = ref<string>('biography')
const showGroupInfoDialog = ref<boolean>(false)
const showGroupBioDialog = ref<boolean>(false)
const showEditableAlbumDialog = ref<boolean>(false)
const showMemberDialog = ref<boolean>(false)
const showNewMemberInput = ref<boolean>(false)
const showPastMemberInput = ref<boolean>(false)
const isCurrentMember = ref<boolean>(false)
const memberMode = ref<string>('add')
const groupInfoRules = ref<FormRules<Group>>({
  country: [{ required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' }],
  formedYear: [{ required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' }],
  status: [{ required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' }],
  genres: [{ min: 1, type: 'array', message: 'Выберите хотя бы 1 жанр', trigger: 'blur' }],
  logo: [{ required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' }],
  banner: [{ required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' }]
})
const groupRef = ref()
const editableMember = ref<Member>(getDefaultMember())
// Computed
const totalMembers = computed((): number => {
  if (!group.value) return 0
  return (group.value.currentMembers?.length || 0) + (group.value.pastMembers?.length || 0)
})

const sortedAlbums = computed((): Album[] => [...albums.value].sort((a, b) => b.releaseDate - a.releaseDate))

const latestAlbums = computed((): Album[] => sortedAlbums.value.slice(0, 5))

const getDiscographyPeriod = computed((): string => {
  if (albums.value.length === 0) return 'Нет данных'

  const years = albums.value.map(album => new Date(album.releaseDate).getFullYear())
  const minYear = Math.min(...years)
  const maxYear = Math.max(...years)

  return minYear === maxYear ? `${minYear}` : `${minYear} - ${maxYear}`
})

// Methods
const removePastMember = async (index: number): Promise<void> => {
  group.value.pastMembers.splice(index, 1)
  await store.updateGroup(group.value)
}
const removeCurrentMember = async (index: number): Promise<void> => {
  group.value.currentMembers.splice(index, 1)
  await store.updateGroup(group.value)
}
const updateMember = async (): Promise<void> => {
  await store.updateMember(editableMember.value, true)
}
const openAddMemberDialog = (): void => {
  editableMember.value = getDefaultMember()
  memberMode.value = 'add'
  showMemberDialog.value = true
}
const openEditMemberDialog = (member: Member): void => {
  if (!store.userIsAdmin) return
  editableMember.value = member
  memberMode.value = 'edit'
  showMemberDialog.value = true
}
const addMemberToGroup = async (): Promise<void> => {
  await store.addMemberToGroup(group.value._id as string, editableMember.value, isCurrentMember.value, true)
  await fetchGroupData()
}

const toggleNewMemberInput = (): void => {
  isCurrentMember.value = true
  showPastMemberInput.value = false
  showNewMemberInput.value = !showNewMemberInput.value
}
const togglePastMemberInput = (): void => {
  isCurrentMember.value = false
  showNewMemberInput.value = false
  showPastMemberInput.value = !showPastMemberInput.value
}
const openAlbumAddDialog = async (): Promise<void> => {
  await store.getGenres()
  showEditableAlbumDialog.value = true
}
const addSocialLink = (): void => {
  group.value.socialLinks.push({
    platform: 'website',
    url: ''
  })
}
const removeSocialLink = (index: number): void => {
  group.value.socialLinks.splice(index, 1)
}
const openYandexSearch = (isLogo: boolean = true) => {
  window.open(
    `https://yandex.ru/images/search?text=${group.value.name} ${isLogo ? 'логотип' : 'фото группы'}`,
    '_blank'
  )
}
const openGroupInfoDialog = async (): Promise<void> => {
  await store.getGenres()
  showGroupInfoDialog.value = true
}
const saveGroupInfo = (): void => {
  groupRef.value.validate(async (isValid: boolean) => {
    if (!isValid) {
      ElNotification({
        type: 'error',
        message: 'Ошибка! Проверьте все поля'
      })
    } else {
      await store.updateGroup(group.value, true)
      showGroupInfoDialog.value = false
    }
  })
}

const formatDescription = (text: string): string => {
  if (!text) return ''
  return text.replace(/\n/g, '<br>')
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const toggleLike = async () => {
  try {
    // API call to like/unlike
    ElMessage.success('Лайк обновлен')
  } catch (error) {
    ElMessage.error('Ошибка при обновлении лайка')
  }
}

const shareGroup = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    ElMessage.success('Ссылка скопирована в буфер обмена')
  } catch (error) {
    ElMessage.error('Ошибка при копировании ссылки')
  }
}

const addToFavorites = () => {
  // API call to add to favorites
  ElMessage.success('Группа добавлена в избранное')
}

// Fetch data
const fetchGroupData = async () => {
  const groupId = route.params.id
  try {
    // Fetch group data
    const groupResponse = await fetch(`/api/groups/${groupId}`)
    if (groupResponse.ok) {
      group.value = await groupResponse.json()
    }

    // Fetch group albums
    const albumsResponse = await fetch(`/api/groups/${groupId}/albums`)
    if (albumsResponse.ok) {
      albums.value = await albumsResponse.json()
    }

    // Fetch similar groups
    const similarResponse = await fetch(`/api/groups/${groupId}/similar`)
    if (similarResponse.ok) {
      similarGroups.value = await similarResponse.json()
    }

    // Fetch related news
    const newsResponse = await fetch(`/api/news/group/${groupId}`)
    if (newsResponse.ok) {
      relatedNews.value = await newsResponse.json()
    }
  } catch (error) {
    console.error('Error fetching group data:', error)
    ElMessage.error('Ошибка загрузки данных группы')
  }
}

watch(route, () => {
  fetchGroupData()
})

onMounted(() => {
  fetchGroupData()
})
</script>

<style scoped>
.group-page {
  min-height: 100vh;
  background: #121212;
  color: #f5f5f5;
}

/* Hero Section */
.group-hero {
  margin-bottom: 20px;
}

.hero-banner {
  height: 400px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content {
  max-width: 1200px;
  width: 100%;
  padding: 0 20px;
}

.group-basic-info {
  display: flex;
  align-items: center;
  gap: 30px;
}

.group-logo-section {
  flex-shrink: 0;
}

.group-logo {
  border: 4px solid #fff;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
}

.group-info-main {
  flex: 1;
}

.group-name {
  font-size: 3rem;
  font-weight: bold;
  margin: 0 0 16px 0;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.group-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #e0e0e0;
  font-size: 1rem;
}

.group-genres {
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

.group-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* Main Content */
.group-main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  gap: 24px;
}

/* Tabs */
:deep(.group-tabs .el-tabs__header) {
  background: #1e1e1e;
  border-radius: 8px 8px 0 0;
  padding: 0 20px;
  margin: 0 0 10px 0;
}

:deep(.group-tabs .el-tabs__nav-wrap) {
  padding: 0;
}

:deep(.group-tabs .el-tabs__item) {
  color: #aaa;
  font-weight: 500;
  padding: 0 20px;
  height: 60px;
  line-height: 60px;
}

:deep(.group-tabs .el-tabs__item.is-active) {
  color: #9e2a2a;
}

:deep(.group-tabs .el-tabs__active-bar) {
  background-color: #9e2a2a;
}

:deep(.group-tabs .el-tabs__content) {
  padding: 0;
}

/* Biography Tab */

.biography-content h3 {
  color: #f5f5f5;
  font-size: 1.5rem;
}

.biography-content h4 {
  color: #f5f5f5;
  margin: 24px 0 12px 0;
  font-size: 1.2rem;
}

.description-text {
  color: #e0e0e0;
  line-height: 1.6;
  font-size: 1rem;
}

.themes-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.theme-tag {
  background: #252525;
  border: 1px solid #444;
  color: #aaa;
}

.social-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* Discography Tab */

.discography-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #333;
}

.discography-header h3 {
  color: #f5f5f5;
  margin: 0;
  font-size: 1.5rem;
}

.discography-stats {
  display: flex;
  gap: 20px;
}

.discography-stats .stat {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #aaa;
  font-size: 0.9rem;
}

.albums-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
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

.cover-image {
  width: 100%;
  height: 100%;
}

.cover-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #333;
  color: #666;
  font-size: 48px;
}

.album-type-tag {
  position: absolute;
  top: 8px;
  right: 8px;
}

.album-info {
  flex: 1;
  padding: 12px;
}

.album-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 6px 0;
  color: #f5f5f5;
  line-height: 1.3;
  overflow: hidden;
  display: -webkit-box;
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

.album-stats .stat {
  display: flex;
  align-items: center;
  gap: 4px;
}

.empty-albums {
  padding: 60px 0;
}

.members-section {
  margin-bottom: 32px;
}

.members-section h3 {
  color: #f5f5f5;
  margin-bottom: 16px;
  font-size: 1.3rem;
  border-bottom: 1px solid #333;
  padding-bottom: 8px;
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.member-card {
  background: #252525;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.member-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  border-color: #9e2a2a;
}

.member-card.past-member {
  opacity: 0.7;
}

.member-avatar {
  margin-bottom: 12px;
}

:deep(.past-avatar) {
  filter: grayscale(1);
}

.member-name {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #f5f5f5;
}

.member-role {
  color: #9e2a2a;
  font-size: 0.85rem;
  margin: 0 0 8px 0;
}

.member-years {
  color: #aaa;
  font-size: 0.8rem;
  margin: 0;
}

.member-instruments {
  display: flex;
  gap: 4px;
  justify-content: center;
  flex-wrap: wrap;
}

/* Similar Groups Tab */
.similar-groups-content {
  padding: 24px;
}

.similar-groups-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.similar-group-card {
  background: #252525;
  border: 1px solid #333;
  cursor: pointer;
  transition: all 0.3s ease;
}

.similar-group-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  border-color: #9e2a2a;
}

.similar-group-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
}

.similar-group-info {
  flex: 1;
}

.similar-group-info .group-name {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #f5f5f5;
  text-shadow: none;
}

.similar-group-info .group-country {
  color: #aaa;
  font-size: 0.85rem;
  margin: 0 0 8px 0;
}

.similar-group-info .group-genres {
  margin: 0;
}

.empty-similar {
  padding: 60px 0;
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

/* Stats Cards */
.stats-cards {
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
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.views {
  background: #2a5c9e;
  color: white;
}
.stat-icon.likes {
  background: #9e2a2a;
  color: white;
}
.stat-icon.albums {
  background: #b38b3b;
  color: white;
}
.stat-icon.members {
  background: #2a9e5e;
  color: white;
}

.stat-number {
  font-size: 1.3rem;
  font-weight: bold;
  color: #f5f5f5;
}

.stat-label {
  font-size: 0.8rem;
  color: #aaa;
}

/* Latest Albums */
.latest-albums {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.album-item {
  display: flex;
  align-items: center;
  border-radius: 6px;
  cursor: pointer;
  padding: 0 10px;
  transition: background-color 0.3s ease;
}

.album-item:hover {
  background: #252525;
}

.album-cover {
  position: relative;
  flex-shrink: 0;
}

.album-type-mini-tag {
  position: absolute;
  top: -6px;
  right: -6px;
  font-size: 0.6rem;
  padding: 2px 4px;
  line-height: 1;
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
  .group-basic-info {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }

  .group-name {
    font-size: 2rem;
  }

  .group-meta {
    justify-content: center;
  }

  .group-actions {
    justify-content: center;
  }

  .discography-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .albums-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .members-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}

@media (max-width: 768px) {
  .hero-banner {
    height: 300px;
  }

  .group-name {
    font-size: 1.5rem;
  }

  .group-meta {
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }

  :deep(.group-tabs .el-tabs__item) {
    padding: 0 12px;
    font-size: 0.9rem;
  }

  .albums-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Custom Element Plus overrides */
:deep(.el-card) {
  background: #1e1e1e;
  border: 1px solid #333;
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
</style>
