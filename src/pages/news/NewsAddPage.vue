<template>
  <div class="news-add-page">
    <div class="page-header">
      <div class="container">
        <h1>Добавить новость</h1>
        <p>Создайте новую статью, рецензию или интервью</p>
      </div>
    </div>

    <div class="container">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="180px"
        label-position="top"
        class="news-form"
        @submit.prevent="submitForm"
      >
        <!-- Basic Information Section -->
        <el-card class="form-section">
          <template #header>
            <div class="section-header">
              <h2>Основная информация</h2>
            </div>
          </template>

          <div class="form-row">
            <el-form-item label="Заголовок" prop="title" class="form-item">
              <el-input
                v-model="form.title"
                placeholder="Введите заголовок новости"
                size="large"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </div>

          <div class="form-row">
            <el-form-item label="Содержание" prop="content" class="form-item">
              <el-input v-model="form.content" type="textarea" :rows="10" placeholder="Полный текст новости..." />
            </el-form-item>
          </div>

          <div class="form-row columns-1">
            <el-form-item label="Категория" prop="category" class="form-item">
              <el-select v-model="form.category" placeholder="Выберите категорию" style="width: 100%">
                <el-option label="Новость" value="news" />
                <el-option label="Рецензия" value="review" />
                <el-option label="Интервью" value="interview" />
                <el-option label="Релиз" value="release" />
              </el-select>
            </el-form-item>
          </div>

          <div class="form-row" v-if="form.isPublished">
            <el-form-item label="Дата публикации" class="form-item">
              <el-date-picker
                v-model="form.publishedAt"
                type="datetime"
                placeholder="Выберите дату и время публикации"
                style="width: 100%"
              />
            </el-form-item>
          </div>
        </el-card>

        <!-- Featured Image Section -->
        <el-card class="form-section">
          <template #header>
            <div class="section-header">
              <h2>Главное изображение</h2>
            </div>
          </template>

          <div class="form-row">
            <div class="image-upload-section">
              <el-input v-model="form.featuredImage" placeholder="Введите ссылку на главное изображение" class="mb-3" />
              <div class="upload-area" :class="{ 'has-image': form.featuredImage }">
                <el-image v-if="form.featuredImage" :src="form.featuredImage" fit="cover" class="preview-image" />
                <div v-else class="upload-placeholder">
                  <el-icon size="48">
                    <Picture />
                  </el-icon>
                  <div class="upload-text">Главное изображение</div>
                  <div class="upload-hint">Добавьте ссылку на изображение выше</div>
                </div>
              </div>
              <div class="upload-actions" v-if="form.featuredImage">
                <el-button type="danger" text @click="removeFeaturedImage">Удалить</el-button>
              </div>
            </div>
          </div>
        </el-card>

        <!-- Tags Section -->
        <el-card class="form-section">
          <template #header>
            <div class="section-header">
              <h2>Теги</h2>
            </div>
          </template>

          <div class="form-row">
            <el-form-item label="Теги" class="form-item">
              <div class="tags-input-section">
                <el-select
                  v-model="form.tags"
                  placeholder="Введите теги"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"
                  style="width: 100%"
                >
                  <el-option v-for="tag in form.tags" :key="tag" :label="tag" :value="tag" />
                </el-select>
              </div>
            </el-form-item>
          </div>
        </el-card>

        <!-- Related Content Section -->
        <el-card class="form-section">
          <template #header>
            <div class="section-header">
              <h2>Связанный контент</h2>
            </div>
          </template>

          <div class="form-row columns-2">
            <el-form-item label="Связанные группы" class="form-item">
              <GroupSearch @select="handleSelectGroup" />
              <el-tag
                v-for="(group, index) in form.relatedGroups"
                :key="group._id"
                type="primary"
                closable
                @close="removeGroup(index)"
              >
                {{ group.name }}
              </el-tag>
            </el-form-item>

            <el-form-item label="Связанные альбомы" class="form-item">
              <AlbumSearch @select="handleSelectAlbum" />
              <el-tag
                v-for="(album, index) in form.relatedAlbums"
                :key="album._id"
                type="primary"
                closable
                @close="removeAlbum(index)"
              >
                {{ album.title }} ({{ album.group.name }})
              </el-tag>
            </el-form-item>
          </div>
        </el-card>

        <!-- Form Actions -->
        <div class="form-actions">
          <el-button type="primary" :loading="loading" @click="submitForm" size="large">
            {{ loading ? 'Добавление...' : 'Добавить новость' }}
          </el-button>
          <el-button @click="resetForm" size="large">Очистить форму</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Picture } from '@element-plus/icons-vue'

import { useStore } from '@/stores/store'
import { useAuthStore } from '@/stores/auth'

import type { Album, Group, News } from '@/types'
import GroupSearch from '@/components/inputs/GroupSearch.vue'
import AlbumSearch from '@/components/inputs/AlbumSearch.vue'

const store = useStore()
const authStore = useAuthStore()

// Refs
const formRef = ref(null)
const loading = ref<boolean>(false)

// Form data
const form = ref<News>({
  title: '',
  content: '',
  author: authStore.user._id,
  views: 0,
  category: 'news',
  tags: [],
  featuredImage: '',
  relatedGroups: [],
  relatedAlbums: [],
  isPublished: false,
  publishedAt: new Date().toDateString()
})

// Validation rules
const rules = reactive({
  title: [
    { required: true, message: 'Введите заголовок новости', trigger: 'blur' },
    { min: 3, message: 'Заголовок должен содержать минимум 3 символа', trigger: 'blur' }
  ],
  content: [{ required: true, message: 'Введите содержание новости', trigger: 'blur' }],
  category: [{ required: true, message: 'Выберите категорию', trigger: 'change' }]
})

// Methods
const removeAlbum = (index: number): void => {
  form.value.relatedAlbums.splice(index, 1)
}
const removeGroup = (index: number): void => {
  form.value.relatedGroups.splice(index, 1)
}
const handleSelectAlbum = (album: Album): void => {
  form.value.relatedAlbums.push(album)
  form.value.relatedGroups.push(album.group)
}
const handleSelectGroup = (group: Group): void => {
  form.value.relatedGroups.push(group)
}
const removeFeaturedImage = () => {
  form.value.featuredImage = ''
}

const submitForm = async () => {
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate()
    if (!valid) return

    loading.value = true
    form.value.author = authStore.user._id

    await store.addNews(form.value)
    resetForm()
  } catch (error) {
    console.error('Error adding news:', error)
    ElMessage.error(error.message || 'Ошибка при добавлении новости')
  } finally {
    loading.value = false
  }
}

const resetForm = async () => {
  await ElMessageBox.confirm(
    'Вы уверены, что хотите очистить форму? Все введенные данные будут потеряны.',
    'Подтверждение',
    {
      confirmButtonText: 'Очистить',
      cancelButtonText: 'Отмена',
      type: 'warning'
    }
  )

  form.value = {
    title: '',
    author: authStore.user._id,
    views: 0,
    content: '',
    category: 'news',
    tags: [],
    featuredImage: '',
    relatedGroups: [],
    relatedAlbums: [],
    isPublished: false,
    publishedAt: new Date().toISOString()
  }

  if (formRef.value) {
    formRef.value.clearValidate()
  }

  ElMessage.success('Форма очищена')
}
</script>

<style scoped>
.news-add-page {
  min-height: 100vh;
  background: #121212;
  color: #f5f5f5;
  padding-bottom: 60px;
}

.page-header {
  background: linear-gradient(135deg, #1a1a1a 0%, #1a2a1a 100%);
  padding: 40px 0;
  border-bottom: 1px solid #333;
  margin-bottom: 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0 0 8px 0;
  color: #fff;
}

.page-header p {
  font-size: 1.1rem;
  color: #aaa;
  margin: 0;
}

/* Form Styles */
.news-form {
  max-width: 100%;
}

.form-section {
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 8px;
  margin-bottom: 12px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h2 {
  margin: 0;
  color: #f5f5f5;
  font-size: 1.3rem;
}

.form-row {
  margin-bottom: 12px;
}

.form-row.columns-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-item {
  margin-bottom: 0;
}

/* Image Upload Styles */
.image-upload-section {
  text-align: center;
}

.upload-area {
  border: 2px dashed #444;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
  background: #252525;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area.has-image {
  border-style: solid;
  padding: 0;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  max-height: 300px;
  object-fit: contain;
}

.upload-placeholder {
  color: #666;
  text-align: center;
}

.upload-text {
  font-weight: 500;
  margin-bottom: 4px;
  color: #aaa;
}

.upload-hint {
  font-size: 0.8rem;
  color: #666;
}

.upload-actions {
  margin-top: 12px;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 40px;
  padding: 20px;
  background: #252525;
  border-radius: 8px;
  border: 1px solid #333;
}

/* Responsive Design */
@media (max-width: 768px) {
  .form-row.columns-2 {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .form-actions {
    flex-direction: column;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .page-header h1 {
    font-size: 2rem;
  }
}
</style>
[file content end]
