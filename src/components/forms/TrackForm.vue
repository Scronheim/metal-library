<script setup lang="ts">
import { type PropType, ref } from 'vue'

import type { FormRules } from 'element-plus'
import type { TrackInfo } from '@/types'

const props = defineProps({
  track: {
    type: Object as PropType<TrackInfo>,
    required: true
  }
})

const lyricsRules = ref<FormRules<TrackInfo>>({
  title: [{ required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' }],
  number: [{ required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' }],
  discNumber: [{ required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' }],
  lyrics: [{ required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' }],
  duration: [{ required: true, message: 'Поле обязательно для заполнения', trigger: 'blur' }]
})
</script>

<template>
  <el-form :model="track" :rules="lyricsRules" label-position="top">
    <div class="track-item">
      <div class="track-header">
        <div>
          <span class="track-number">
            Трек №
            <el-input-number v-model.number="track.number" :min="1" />
          </span>
          <span class="track-number">
            Диск №
            <el-input-number v-model.number="track.discNumber" :min="1" />
          </span>
        </div>
      </div>

      <div class="track-fields">
        <el-form-item label="Название трека" prop="title" class="track-field">
          <el-input v-model="track.title" placeholder="Введите название трека" maxlength="100" />
        </el-form-item>

        <el-form-item label="Длительность" prop="duration" class="track-field">
          <el-input v-model="track.duration" placeholder="Длительность (чч:мм:сс)" maxlength="5" type="time" step="1">
            <template #append>
              <span class="duration-hint">мм:сс</span>
            </template>
          </el-input>
        </el-form-item>
      </div>

      <el-form-item label="Текст песни" class="lyrics-field">
        <el-input
          v-model="track.lyrics"
          type="textarea"
          :rows="4"
          placeholder="Введите текст песни"
          maxlength="5000"
          show-word-limit
        />
      </el-form-item>
    </div>
  </el-form>
</template>

<style lang="css" scoped>
/* Tracklist Styles */
.tracklist-editor {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  text-align: center;
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
</style>
