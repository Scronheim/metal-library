<template>
  <div class="group-add-page">
    <div class="page-header">
      <div class="container">
        <h1>Добавить новую группу</h1>
        <p>Заполните информацию о музыкальной группе</p>
      </div>
    </div>

    <div class="container">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="180px"
        label-position="top"
        class="group-form"
        @submit.prevent="submitForm"
      >
        <!-- Basic Information Section -->
        <el-card class="form-section">
          <template #header>
            <div class="section-header">
              <h2>Основная информация</h2>
              <el-tag type="info">Обязательные поля</el-tag>
            </div>
          </template>

          <div class="form-row">
            <el-form-item label="Название группы" prop="name" class="form-item">
              <el-input
                v-model="form.name"
                placeholder="Введите название группы"
                size="large"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </div>

          <div class="form-row">
            <el-form-item label="Описание группы" prop="description" class="form-item">
              <el-input
                v-model="form.description"
                type="textarea"
                :rows="6"
                placeholder="Опишите историю группы, музыкальный стиль, достижения..."
                maxlength="2000"
                show-word-limit
              />
            </el-form-item>
          </div>

          <div class="form-row columns-2">
            <el-form-item label="Страна" prop="country" class="form-item">
              <el-select v-model="form.country" placeholder="Выберите страну" filterable style="width: 100%">
                <el-option
                  v-for="country in store.countries"
                  :key="country.alpha2"
                  :label="country.name"
                  :value="country.name"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="Город" class="form-item">
              <el-input v-model="form.city" placeholder="Введите город" />
            </el-form-item>
          </div>

          <div class="form-row columns-2">
            <el-form-item label="Год основания" prop="formedYear" class="form-item">
              <el-input-number
                v-model="form.formedYear"
                :min="1900"
                :max="new Date().getFullYear()"
                placeholder="Год основания"
                style="width: 100%"
              />
            </el-form-item>

            <el-form-item label="Статус группы" prop="status" class="form-item">
              <el-select v-model="form.status" placeholder="Выберите статус" style="width: 100%">
                <el-option label="Активна" value="active" />
                <el-option label="Распалась" value="split-up" />
                <el-option label="На паузе" value="on-hold" />
                <el-option label="Неизвестно" value="unknown" />
              </el-select>
            </el-form-item>
          </div>
        </el-card>

        <!-- Images Section -->
        <el-card class="form-section">
          <template #header>
            <div class="section-header">
              <h2>Изображения</h2>
              <el-tag type="info">Необязательные поля</el-tag>
            </div>
          </template>

          <div class="form-row columns-2">
            <!-- Logo Upload -->
            <div class="image-upload-section">
              <h3>Логотип группы</h3>
              <el-input v-model="form.logo" placeholder="Введите ссылку на картинку" class="mb-3" />
              <div class="upload-area" :class="{ 'has-image': form.logo }">
                <el-image v-if="form.logo" :src="form.logo" fit="cover" class="preview-image" />
                <div v-else class="upload-placeholder">
                  <el-icon size="48">
                    <Picture />
                  </el-icon>
                </div>
              </div>
              <div class="upload-actions" v-if="form.logo">
                <el-button type="danger" text @click="removeLogo">Удалить</el-button>
              </div>
            </div>

            <!-- Banner Upload -->
            <div class="image-upload-section">
              <h3>Баннер группы</h3>
              <el-input v-model="form.banner" placeholder="Введите ссылку на картинку" class="mb-3" />
              <div class="upload-area" :class="{ 'has-image': form.banner }">
                <el-image v-if="form.banner" :src="form.banner" fit="cover" class="preview-image" />
                <div v-else class="upload-placeholder">
                  <el-icon size="48">
                    <Picture />
                  </el-icon>
                </div>
              </div>
              <div class="upload-actions" v-if="form.banner">
                <el-button type="danger" text @click="removeBanner">Удалить</el-button>
              </div>
            </div>
          </div>
        </el-card>

        <!-- Genres & Themes Section -->
        <el-card class="form-section">
          <template #header>
            <div class="section-header">
              <h2>Жанры и тематика</h2>
            </div>
          </template>

          <div class="form-row">
            <el-form-item label="Музыкальные жанры" prop="genres" class="form-item">
              <el-select
                v-model="form.genres"
                placeholder="Выберите или введите жанр"
                filterable
                multiple
                value-key="name"
                style="width: 300px; margin-bottom: 10px"
              >
                <el-option v-for="genre in store.availableGenres" :key="genre._id" :label="genre.name" :value="genre" />
              </el-select>
            </el-form-item>
          </div>

          <div class="form-row">
            <el-form-item label="Тематика" class="form-item">
              <div class="tags-input-section">
                <el-input
                  v-model="newTheme"
                  placeholder="Введите тематику"
                  style="width: 300px; margin-bottom: 10px"
                  @keyup.enter="addTheme"
                >
                  <template #append>
                    <el-button @click="addTheme">Добавить</el-button>
                  </template>
                </el-input>

                <div class="tags-container">
                  <el-tag
                    v-for="(theme, index) in form.themes"
                    :key="index"
                    closable
                    type="info"
                    @close="removeTheme(index)"
                    class="theme-tag"
                  >
                    {{ theme }}
                  </el-tag>

                  <div v-if="form.themes.length === 0" class="empty-tags">Тематика не добавлена</div>
                </div>
              </div>
            </el-form-item>
          </div>
        </el-card>

        <!-- Social Links Section -->
        <el-card class="form-section">
          <template #header>
            <div class="section-header">
              <h2>Социальные сети и ссылки</h2>
            </div>
          </template>

          <div class="social-links-section">
            <SocialLinkForm v-for="(link, index) in form.socialLinks" :link="link" />

            <div class="add-link-section">
              <el-button type="primary" :icon="Plus" @click="addSocialLink" text>Добавить ссылку</el-button>
            </div>
          </div>
        </el-card>

        <!-- Members Section -->
        <el-card class="form-section">
          <template #header>
            <div class="section-header">
              <h2>Участники группы</h2>
              <el-tag type="warning">Опционально</el-tag>
            </div>
          </template>

          <div class="members-section">
            <div class="members-tabs">
              <el-tabs v-model="activeMembersTab">
                <el-tab-pane label="Текущий состав" name="current">
                  <div class="members-list">
                    <div v-for="(member, index) in form.currentMembers" :key="index" class="member-item">
                      <div class="member-row">
                        <el-input
                          v-model="member.name"
                          placeholder="Имя участника"
                          style="width: 250px; margin-right: 12px"
                        />

                        <el-input
                          v-model="member.role"
                          placeholder="Роль в группе"
                          style="flex: 1; margin-right: 12px"
                        />

                        <el-button type="danger" :icon="Remove" circle @click="removeCurrentMember(index)" />
                      </div>
                    </div>

                    <div class="add-member-section">
                      <el-button type="primary" :icon="Plus" @click="addCurrentMember" text>
                        Добавить участника
                      </el-button>
                    </div>
                  </div>
                </el-tab-pane>

                <el-tab-pane label="Бывшие участники" name="past">
                  <div class="members-list">
                    <div v-for="(member, index) in form.pastMembers" :key="index" class="member-item">
                      <div class="member-row">
                        <el-input
                          v-model="member.name"
                          placeholder="Имя участника"
                          style="width: 250px; margin-right: 12px"
                        />

                        <el-input
                          v-model="member.role"
                          placeholder="Роль в группе"
                          style="width: 200px; margin-right: 12px"
                        />

                        <el-input
                          v-model="member.years"
                          placeholder="Годы участия (например: 1994-2000)"
                          style="flex: 1; margin-right: 12px"
                        />

                        <el-button type="danger" :icon="Remove" circle @click="removePastMember(index)" />
                      </div>
                    </div>

                    <div class="add-member-section">
                      <el-button type="primary" :icon="Plus" @click="addPastMember" text>
                        Добавить бывшего участника
                      </el-button>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </el-card>

        <!-- Form Actions -->
        <div class="form-actions">
          <el-button type="primary" :loading="loading" @click="submitForm" size="large">
            {{ loading ? 'Добавление...' : 'Добавить группу' }}
          </el-button>
          <el-button @click="resetForm" size="large">Очистить форму</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Remove, Picture } from '@element-plus/icons-vue'

import { useStore } from '@/stores/store'

import type { Group } from '@/types'
import SocialLinkForm from '@/components/forms/SocialLinkForm.vue'

const store = useStore()

// Refs
const formRef = ref(null)
const loading = ref(false)
const newTheme = ref('')
const activeMembersTab = ref('current')

// Form data
const form = ref<Group>({
  name: '',
  description: '',
  country: '',
  city: '',
  formedYear: new Date().getFullYear(),
  status: 'active',
  genres: [],
  themes: [],
  logo: '',
  banner: '',
  socialLinks: [],
  currentMembers: [],
  pastMembers: [],
  stats: {
    albumsCount: 0,
    likes: [],
    views: 0
  }
})

// Validation rules
const rules = reactive({
  name: [
    { required: true, message: 'Введите название группы', trigger: 'blur' },
    { min: 2, message: 'Название должно содержать минимум 2 символа', trigger: 'blur' }
  ],
  description: [{ required: true, message: 'Введите описание группы', trigger: 'blur' }],
  country: [{ required: true, message: 'Выберите страну', trigger: 'change' }],
  formedYear: [
    { required: true, message: 'Введите год основания', trigger: 'blur' },
    { type: 'number', min: 1900, max: new Date().getFullYear(), message: 'Введите корректный год', trigger: 'blur' }
  ],
  status: [{ required: true, message: 'Выберите статус группы', trigger: 'change' }],
  genres: [{ required: true, message: 'Добавьте хотя бы один жанр', trigger: 'change' }]
})

// Methods
const removeLogo = () => {
  form.value.logo = ''
}

const removeBanner = () => {
  form.value.banner = ''
}

const addTheme = () => {
  if (newTheme.value && !form.value.themes.includes(newTheme.value)) {
    form.value.themes.push(newTheme.value)
    newTheme.value = ''
  }
}

const removeTheme = index => {
  form.value.themes.splice(index, 1)
}

const addSocialLink = () => {
  form.value.socialLinks.push({
    platform: '',
    url: ''
  })
}

const removeSocialLink = index => {
  form.socialLinks.splice(index, 1)
}

const addCurrentMember = () => {
  form.value.currentMembers.push({
    name: '',
    role: ''
  })
}

const removeCurrentMember = index => {
  form.value.currentMembers.splice(index, 1)
}

const addPastMember = () => {
  form.value.pastMembers.push({
    name: '',
    role: '',
    years: ''
  })
}

const removePastMember = index => {
  form.value.pastMembers.splice(index, 1)
}

const submitForm = async () => {
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate()
    if (!valid) return

    loading.value = true

    await store.addGroup(form.value)
  } catch (error) {
    console.error('Error adding group:', error)
    ElMessage.error(error.message || 'Ошибка при добавлении группы')
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

  Object.assign(form, {
    _id: '',
    name: '',
    description: '',
    country: '',
    city: '',
    formedYear: new Date().getFullYear(),
    status: 'active',
    genres: [],
    themes: [],
    logo: '',
    banner: '',
    socialLinks: [],
    currentMembers: [],
    pastMembers: []
  })

  if (formRef.value) {
    formRef.value.clearValidate()
  }

  ElMessage.success('Форма очищена')
}

onMounted(async () => {
  await store.getGenres()
  addSocialLink()
  addCurrentMember()
})
</script>

<style scoped>
.group-add-page {
  min-height: 100vh;
  background: #121212;
  color: #f5f5f5;
  padding-bottom: 60px;
}

.page-header {
  background: linear-gradient(135deg, #1a1a1a 0%, #2a1a1a 100%);
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
.group-form {
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

.image-upload-section h3 {
  color: #f5f5f5;
  margin-bottom: 16px;
  font-size: 1.1rem;
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

.banner-upload {
  min-height: 150px;
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

/* Tags Styles */
.tags-input-section {
  margin-bottom: 16px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 40px;
  align-items: center;
}

.genre-tag,
.theme-tag {
  margin: 2px;
}

.empty-tags {
  color: #666;
  font-style: italic;
  font-size: 0.9rem;
}

/* Members Styles */
.members-section {
  padding: 0;
}

.members-list {
  padding: 20px;
}

.member-item {
  margin-bottom: 16px;
  padding: 16px;
  background: #252525;
  border-radius: 6px;
  border: 1px solid #333;
}

.member-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.add-member-section {
  padding: 16px;
  text-align: center;
  border: 1px dashed #444;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-member-section:hover {
  border-color: #9e2a2a;
  background: #252525;
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

  .link-row,
  .member-row {
    flex-direction: column;
    align-items: stretch;
  }

  .link-row .el-select,
  .link-row .el-input,
  .member-row .el-input {
    width: 100% !important;
    margin: 4px 0 !important;
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
