<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue'

const emits = defineEmits(['confirm'])
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
  }
})
</script>

<template>
  <el-popconfirm
    title="Вы действительно хотите это удалить?"
    placement="top"
    width="200"
    confirm-button-text="Да"
    cancel-button-text="Нет"
    confirm-button-type="danger"
    @confirm="$emit('confirm')"
  >
    <template #reference>
      <el-button :icon="Delete" circle size="small" class="actions-btn" @click.stop />
    </template>
  </el-popconfirm>
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
