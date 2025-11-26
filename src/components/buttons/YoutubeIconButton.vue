<script setup lang="ts">
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiYoutube } from '@mdi/js'

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
  }
})
</script>

<template>
  <el-tooltip content="Открыть клип в новой вкладке">
    <el-button circle size="small" class="actions-btn" @click.stop="$emit('click')">
      <SvgIcon type="mdi" :path="mdiYoutube" :size="16" />
    </el-button>
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
