<script setup lang="ts">
import { Plus, Close } from '@element-plus/icons-vue'

const emits = defineEmits(['click'])
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'small'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  cssClass: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  isCloseEdit: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <el-tooltip effect="dark" :content="isCloseEdit ? 'Закрыть добавление' : 'Добавить'" placement="top">
    <el-button
      :icon="isCloseEdit ? Close : Plus"
      circle
      size="small"
      class="actions-btn"
      @click.stop="$emit('click')"
    />
  </el-tooltip>
</template>

<style lang="css" scoped>
.actions-btn {
  background: transparent;
  border: 1px solid #444;
  color: #9e2a2a;
}

.actions-btn:hover {
  background: #9e2a2a;
  border-color: #9e2a2a;
  color: white;
}
</style>
