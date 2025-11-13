<script setup lang="ts">
import { type PropType } from 'vue'
import { User } from '@element-plus/icons-vue'

import { useStore } from '@/stores/store'

import type { Member } from '@/types'

const store = useStore()

// Emits
const emit = defineEmits(['openEditMemberDialog', 'removeMember'])
// Props
const props = defineProps({
  member: {
    type: Object as PropType<Member>,
    required: true
  }
})
</script>

<template>
  <div class="member-card" @click="emit('openEditMemberDialog')">
    <div class="member-avatar">
      <el-avatar :size="80" :src="member.photo" :alt="member.name">
        <el-icon v-if="!member.photo"><User /></el-icon>
      </el-avatar>
    </div>
    <div class="member-info">
      <h4 class="member-name">
        {{ member.name }}
        <template v-if="member.birthName">({{ member.birthName }})</template>
      </h4>
      <div class="member-instruments">
        <el-tag v-for="instrument in member.instruments" :key="instrument" size="small" effect="plain">
          {{ instrument }}
        </el-tag>
      </div>
      <DeleteIconButton v-if="store.userIsAdmin" @confirm="emit('removeMember')" />
    </div>
  </div>
</template>

<style lang="css" scoped></style>
