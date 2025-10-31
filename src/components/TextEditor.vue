<template>
  <el-card :header="cardTitle" class="mb-3">
    <QuillEditor ref="editor" v-model:content="content" :options="options" />
    <template #footer>
      <div class="flex justify-start">
        <el-rate v-model="props.review.rating" :colors="colors" allow-half />
      </div>
      <div class="flex justify-end">
        <el-button type="success" @click="saveContent">Отправить</el-button>
      </div>
    </template>
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed, type PropType } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@/styles/quill.smoke.css'

import type { Review } from '@/types'

const emits = defineEmits(['saveContent'])
const props = defineProps({
  review: {
    type: Object as PropType<Review>,
    required: false,
    default: () => {
      return {}
    }
  },
  mode: {
    type: String,
    default: 'add', // 'add' or 'edit'
    validator: (value: string) => ['add', 'edit'].includes(value)
  }
})

const editor = ref(null)
const content = ref('')
const rating = ref(0)
const colors = ref(['#99A9BF', '#F7BA2A', '#FF9900'])
const options = ref({
  modules: {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'strike', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block', 'link'],
      ['clean']
    ]
  },
  placeholder: 'Введите текст обзора',
  theme: 'snow'
})

const cardTitle = computed(() => (props.mode === 'add' ? 'Добавить обзор' : 'Редактировать обзор'))

const saveContent = () => {
  emits('saveContent', JSON.stringify(content.value), editor.value.getText(), rating.value)
}
</script>

<style scoped></style>
