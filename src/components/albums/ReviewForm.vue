<script setup lang="ts">
import { type PropType } from 'vue'

import TextEditor from '@/components/TextEditor.vue'

import type { Review } from '@/types'

// Props
const props = defineProps({
  review: {
    type: Object as PropType<Review>,
    required: true
  }
})
</script>

<template>
  <TextEditor v-if="review.isEdit" :review="review" mode="edit" />
  <el-card v-else class="mb-2" style="width: 100%">
    <template #header>
      <div class="flex justify-between">
        <div class="flex justify-start gap-2">
          Обзор от пользователя
          <b>{{ review.user.username }}</b>
        </div>
      </div>
    </template>
    <p v-html="review.safeHTML" />
    <template #footer>
      <div class="flex items-center gap-1">
        Рейтинг альбома:
        <el-rate v-model="review.rating" disabled allow-half />
      </div>
    </template>
  </el-card>
</template>
