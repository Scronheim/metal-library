<template>
  <el-dialog
    v-model="visible"
    :title="mode === 'add' ? 'Добавить альбом' : 'Редактировать альбом'"
    width="900px"
    :before-close="handleClose"
    class="album-form-dialog"
    top="5vh"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="150px"
      label-position="top"
      @submit.prevent="submitForm"
    >
      <!-- Basic Information -->
      <div class="form-section">
        <h3 class="section-title">Основная информация</h3>

        <div class="form-row columns-2">
          <el-form-item label="Название альбома" prop="title" class="form-item">
            <el-input v-model="form.title" placeholder="Введите название альбома" maxlength="100" show-word-limit />
          </el-form-item>
          <el-form-item label="Группа" prop="group" class="form-item">
            <div class="flex gap-2 mb-2">
              <AddIconButton
                :is-close-edit="addGroupInputVisible"
                @click="addGroupInputVisible = !addGroupInputVisible"
              />
              <el-tag
                class="gap-2"
                v-for="(group, index) in form.groups"
                :key="group._id"
                type="primary"
                closable
                @close="removeGroup(index)"
              >
                {{ group.name }}
              </el-tag>
            </div>
            <el-autocomplete
              v-if="addGroupInputVisible"
              v-model="searchQuery"
              :fetch-suggestions="searchGroup"
              clearable
              value-key="name"
              @select="handleSelectGroup"
            />
          </el-form-item>
        </div>

        <div class="form-row columns-2">
          <el-form-item label="Тип альбома" prop="type" class="form-item">
            <el-select v-model="form.type">
              <el-option v-for="(value, key) in store.albumTypesMap" :label="value" :value="key" />
            </el-select>
          </el-form-item>
          <el-form-item label="Жанры" prop="genres">
            <el-select multiple filterable value-key="name" v-model="form.genres">
              <el-option v-for="genre in store.availableGenres" :key="genre._id" :label="genre.name" :value="genre" />
            </el-select>
          </el-form-item>
        </div>

        <div class="form-row columns-2">
          <el-form-item label="Дата выхода" class="form-item">
            <el-date-picker
              v-model="form.releaseDate"
              type="date"
              placeholder="Выберите дату"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item label="Формат" class="form-item">
            <el-input v-model="form.format" placeholder="CD, Vinyl, Digital, Cassette..." />
          </el-form-item>
        </div>

        <div class="form-row columns-2">
          <el-form-item label="Лейбл" class="form-item">
            <el-input v-model="form.label" placeholder="Название лейбла" />
          </el-form-item>

          <el-form-item label="Каталожный номер" class="form-item">
            <el-input v-model="form.catalogId" placeholder="Каталожный номер" />
          </el-form-item>
        </div>
      </div>

      <!-- Cover Upload -->
      <div class="form-section">
        <h3 class="section-title">Обложка альбома</h3>

        <div class="flex gap-2">
          <div class="grow">
            <el-input v-model="form.cover" placeholder="Введите ссылку на обложку" />
          </div>
          <el-image style="max-width: 300px; max-height: 300px" :src="form.cover">
            <template #error>
              <div class="cover-placeholder">
                <SvgIcon type="mdi" :path="mdiAlbum" :size="18" />
              </div>
            </template>
          </el-image>
        </div>
      </div>

      <!-- Tracklist -->
      <el-collapse>
        <el-collapse-item name="tracklist">
          <template #title>
            Треклист
            <el-button @click.stop="parseTracklistFromDiscogs">Вставить из буфера обмена</el-button>
          </template>
          <el-button type="primary" :icon="Plus" @click="addTrack" size="small">Добавить трек</el-button>
          <div class="tracklist-editor">
            <TrackForm
              v-for="(track, index) in form.tracks"
              :key="index"
              :track="track"
              @delete-track="removeTrack(index)"
            />
            <div class="empty-tracks" v-if="form.tracks.length === 0">
              <el-icon><Headset /></el-icon>
              <p>Треки не добавлены</p>
            </div>
          </div>
          <el-button type="primary" :icon="Plus" @click="addTrack" size="small">Добавить трек</el-button>

          <div class="tracklist-stats" v-if="form.tracks.length > 0">
            <span>Всего треков: {{ form.tracks.length }}</span>
            <span>Общая длительность: {{ albumTotalDuration }}</span>
          </div>
        </el-collapse-item>
        <el-collapse-item title="Соц.сети" name="socialLinks">
          <el-dropdown v-if="authStore.userIsAdmin" @command="handleCommand">
            <el-button type="info" class="mb-2">
              Добавить ссылку
              <el-icon><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="(value, key) in store.socialPlatformNamesMap" :key="key" :command="key">
                  {{ value }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <SocialLinkForm
            v-for="(link, index) in form.socialLinks"
            :key="link.platform"
            :link="link"
            class="mb-2"
            @remove-link="removeSocialLink(index)"
          />
        </el-collapse-item>
      </el-collapse>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">Отмена</el-button>
        <el-button type="primary" :loading="loading" @click="submitForm">
          {{ loading ? 'Сохранение...' : mode === 'add' ? 'Добавить альбом' : 'Сохранить изменения' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, nextTick, onMounted, type PropType } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, ArrowDown, Headset } from '@element-plus/icons-vue'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiAlbum } from '@mdi/js'
import dayjs from 'dayjs'
import durationPlugin from 'dayjs/plugin/duration'

import { useStore } from '@/stores/store'
import { useAuthStore } from '@/stores/auth'

import SocialLinkForm from '../forms/SocialLinkForm.vue'
import TrackForm from '../forms/TrackForm.vue'
import AddIconButton from '../buttons/AddIconButton.vue'

import { getDefaultAlbum } from '@/consts'

import type { Album, Group, TrackInfo } from '@/types'

dayjs.extend(durationPlugin)

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  mode: {
    type: String,
    default: 'add', // 'add' or 'edit'
    validator: (value: string) => ['add', 'edit'].includes(value)
  },
  album: {
    type: Object as PropType<Album>,
    default: getDefaultAlbum()
  },
  groups: {
    type: Array as PropType<Group[]>,
    required: true
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'success', 'close'])
// Store
const store = useStore()
const authStore = useAuthStore()

// Refs
const formRef = ref(null)
const loading = ref(false)
const addGroupInputVisible = ref(false)
const searchQuery = ref('')
const foundedGroups = ref<Group[]>([])

// Form data
const form = reactive<Album>(getDefaultAlbum())

// Validation rules
const rules = reactive({
  title: [
    { required: true, message: 'Введите название альбома', trigger: 'blur' },
    { min: 1, message: 'Название не может быть пустым', trigger: 'blur' }
  ],
  groups: [{ required: true, message: 'Выберите группу', trigger: 'change' }],
  type: [{ required: true, message: 'Выберите тип альбома', trigger: 'change' }],
  genres: [{ required: true, message: 'Выберите жанры', trigger: 'change' }],
  releaseDate: [{ required: true, message: 'Введите дату релиза', trigger: 'blur' }]
})
// Computed
const visible = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

// Methods
const removeGroup = (index: number): void => {
  form.groups.splice(index, 1)
}
const handleCommand = (platform: string): void => {
  form.socialLinks.push({
    platform,
    url: ''
  })
}
const handleSelectGroup = (group: Group): void => {
  form.groups.push(group)
  searchQuery.value = ''
}
const searchGroup = async (queryString: string, cb: any): Promise<void> => {
  if (!queryString) return cb([])
  const { data } = await store.searchGroup(queryString)
  foundedGroups.value = data.groups
  cb(data.groups)
}

const removeCover = (): void => {
  form.cover = ''
}

const addTrack = (): void => {
  const lastTrack = form.tracks.at(-1) as TrackInfo
  form.tracks.push({
    number: lastTrack?.number + 1 || 1,
    title: '',
    duration: '00:00:01',
    lyrics: '',
    discNumber: lastTrack ? lastTrack.discNumber : 1,
    isInstrumental: false,
    videoLink: ''
  })
}

const removeTrack = (index: number): void => {
  form.tracks.splice(index, 1)
}

const removeSocialLink = (index: number): void => {
  form.socialLinks.splice(index, 1)
}

const albumTotalDuration = computed((): string => {
  const totalSeconds = form.tracks.reduce((total, track) => {
    const [hours, minutes, seconds] = track.duration.split(':').map(i => parseInt(i))
    return total + dayjs.duration({ hours, minutes, seconds }).asSeconds()
  }, 0)

  return dayjs.duration(totalSeconds, 'seconds').format('HH:mm:ss')
})

const resetForm = (): void => {
  Object.assign(form, getDefaultAlbum())

  if (formRef.value) formRef.value.clearValidate()
}

const loadAlbumData = async (): Promise<void> => {
  if (props.mode === 'edit' && props.album) Object.assign(form, props.album)
  else if (props.mode === 'add') form.groups = props.groups
}

const submitForm = async (): Promise<void> => {
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate()
    if (!valid) return

    // Validate tracks
    const invalidTracks = form.tracks.filter(track => !track.title || !track.duration)
    if (invalidTracks.length > 0) {
      ElMessage.error('Заполните названия и длительности всех треков')
      return
    }

    loading.value = true

    if (props.mode === 'add') await store.addAlbum(form, true)
    else await store.updateAlbum(form, true)
    emit('success')
  } catch (error) {
    console.error('Error saving album:', error)
    ElMessage.error(error.message || 'Ошибка при сохранении альбома')
  } finally {
    loading.value = false
    emit('close')
  }
}

const handleClose = () => {
  visible.value = false
  resetForm()
  emit('close')
}

// Watchers
watch(visible, newVal => {
  if (newVal) nextTick(() => loadAlbumData())
})

// Initialize
onMounted(() => {
  if (visible.value) loadAlbumData()
})

const parseTracklistFromDiscogs = async () => {
  const clipboardContents = await navigator.clipboard.read()
  const blob = await clipboardContents[0].getType('text/plain')
  const blobText = await blob.text()
  const temp = blobText.split('\n')
  temp.map((i, index) => {
    const temp1 = i.split('\t')

    if (temp1.length === 4) {
      form.tracks.push({
        number: index + 1,
        title: temp1[2],
        duration: `00:0${temp1[3].replace('\r', '')}`,
        discNumber: 1,
        isInstrumental: false,
        lyrics: ''
      })
    } else {
      const duration = temp1[1] ? `00:0${temp1[1].replace('\r', '')}` : ''
      form.tracks.push({
        number: index + 1,
        title: temp1[0],
        duration,
        discNumber: 1,
        isInstrumental: false,
        lyrics: ''
      })
    }
  })
}
</script>

<style scoped>
.album-form-dialog {
  --el-dialog-bg-color: #1e1e1e;
  --el-dialog-border-color: #333;
}

:deep(.el-dialog) {
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 8px;
}

:deep(.el-dialog__header) {
  background: #252525;
  border-bottom: 1px solid #333;
  margin: 0;
  padding: 20px;
}

:deep(.el-dialog__title) {
  color: #f5f5f5;
  font-size: 1.3rem;
  font-weight: 600;
}

:deep(.el-dialog__body) {
  padding: 20px;
  max-height: 70vh;
  overflow-y: auto;
}

:deep(.el-dialog__footer) {
  background: #252525;
  border-top: 1px solid #333;
  padding: 20px;
}

/* Form Styles */
.form-section {
  border-bottom: 1px solid #333;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-title {
  color: #f5f5f5;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header .section-title {
  margin: 0;
}

.form-row {
  margin-bottom: 10px;
}

.form-row.columns-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-item {
  margin-bottom: 0;
}

:deep(.form-item .el-form-item__label) {
  color: #f5f5f5;
  font-weight: 500;
}

:deep(.el-input__inner),
:deep(.el-textarea__inner),
:deep(.el-select .el-input__inner),
:deep(.el-input__inner:focus),
:deep(.el-textarea__inner:focus) {
  border-color: #9e2a2a;
}

:deep(.el-input-number .el-input__inner) {
  text-align: left;
}

/* Group Option Styles */
.group-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.option-avatar {
  flex-shrink: 0;
}

.option-text {
  flex: 1;
  color: #f5f5f5;
}

.option-meta {
  color: #666;
  font-size: 0.8rem;
}

/* Cover Upload Styles */
.cover-upload-section {
  text-align: center;
}

.cover-preview {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.cover-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #666;
}

.cover-error i {
  font-size: 3rem;
  margin-bottom: 8px;
}

.cover-placeholder {
  color: #666;
  display: flex;
  justify-content: center;
  align-items: center;
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

.cover-actions {
  margin-top: 12px;
}

/* Tracklist Styles */
.tracklist-editor {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.track-item {
  padding: 16px;
  background: #252525;
  border-radius: 6px;
  border: 1px solid #333;
}

.track-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #333;
}

.track-number {
  color: #9e2a2a;
  font-weight: 600;
  font-size: 0.9rem;
}

.track-fields {
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 12px;
  margin-bottom: 12px;
}

.track-field {
  margin-bottom: 0;
}

.lyrics-field {
  margin-bottom: 0;
}

.duration-hint {
  color: #666;
  font-size: 0.8rem;
  padding: 0 8px;
}

.empty-tracks {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #666;
  border: 2px dashed #333;
  border-radius: 6px;
}

.empty-tracks i {
  font-size: 2rem;
  margin-bottom: 8px;
  display: block;
}

.empty-tracks p {
  margin: 0;
}

.tracklist-stats {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #333;
  color: #aaa;
  font-size: 0.9rem;
}

/* Dialog Footer */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* Responsive Design */
@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: 95% !important;
    margin: 20px auto;
  }

  .form-row.columns-2 {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .track-fields {
    grid-template-columns: 1fr;
  }

  .cover-upload-area {
    max-width: 100%;
  }

  .cover-preview {
    height: 200px;
  }
}
</style>
