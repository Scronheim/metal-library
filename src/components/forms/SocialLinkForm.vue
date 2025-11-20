<script setup lang="ts">
import { type PropType } from 'vue'
import { Remove } from '@element-plus/icons-vue'

import { useStore } from '@/stores/store'

import type { SocialNetwork } from '@/types'
import DeleteIconButton from '../buttons/DeleteIconButton.vue'

const store = useStore()

const emit = defineEmits(['removeLink'])
const props = defineProps({
  link: {
    type: Object as PropType<SocialNetwork>,
    required: true
  }
})
</script>

<template>
  <div class="social-link-item">
    <div class="link-row">
      <el-select v-model="link.platform" placeholder="Платформа" style="width: 180px">
        <el-option v-for="(value, key) in store.socialPlatformNamesMap" :key="value" :label="value" :value="key" />
      </el-select>

      <el-input v-model="link.url" placeholder="URL ссылка" style="flex: 1; margin: 0 12px" />
      <DeleteIconButton @confirm="emit('removeLink')" />
    </div>
  </div>
</template>

<style lang="css" scoped>
.social-link-item {
  padding: 16px;
  background: #252525;
  border-radius: 6px;
  border: 1px solid #333;
}

.link-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.add-link-section {
  padding: 16px;
  text-align: center;
  border: 1px dashed #444;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-link-section:hover {
  border-color: #9e2a2a;
  background: #252525;
}
</style>
