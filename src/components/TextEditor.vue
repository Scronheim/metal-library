<template>
  <el-card header="Комментарий" class="mb-3">
    <QuillEditor ref="editor" v-model:content="content" :options="options" />
    <template #footer>
      <div class="flex justify-start">
        <el-rate v-model="rating" :colors="colors" allow-half />
      </div>
      <div class="flex justify-end">
        <el-button type="success" @click="saveContent">Отправить</el-button>
      </div>
    </template>
  </el-card>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@/styles/quill.smoke.css'

const emits = defineEmits(['saveContent'])

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
  placeholder: 'Введите коментарий',
  theme: 'snow'
})

const saveContent = () => {
  emits('saveContent', JSON.stringify(content.value), editor.value.getText(), rating.value)
}
</script>

<style scoped></style>
