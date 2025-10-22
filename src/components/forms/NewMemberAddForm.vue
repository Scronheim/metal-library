<script setup lang="ts">
import { ref, type PropType } from 'vue'

import { useStore } from '@/stores/store'

import type { Group, Member } from '@/types'

const emit = defineEmits(['openAddMemberDialog', 'addMemberToGroup'])
const props = defineProps({
  group: {
    type: Object as PropType<Group>
  },
  member: {
    type: Object as PropType<Member>,
    required: true
  }
})

const store = useStore()

const queryMember = ref('')
const foundedMembers = ref<Member[]>([])

const handleNewMember = (member: Member): void => {
  props.member = member
}
const searchMember = async (queryString: string, cb: any): Promise<void> => {
  if (!queryString) return cb([])
  const { data } = await store.searchMember(queryString)
  foundedMembers.value = data
  cb(data)
}
</script>

<template>
  <el-button type="primary" class="mb-2" @click="emit('openAddMemberDialog')">Добавить нового участника</el-button>
  <div class="flex gap-2 mb-2">
    <el-autocomplete
      v-model="queryMember"
      :fetch-suggestions="searchMember"
      clearable
      placeholder="Введите имя участника"
      value-key="name"
      style="width: 250px"
      @select="handleNewMember"
    >
      <template #default="{ item }">{{ item.name }} ({{ item.birthName }})</template>
    </el-autocomplete>
    <!-- <el-select v-model="editableMember.roles" multiple placeholder="Выберите роль">
                      <el-option
                        v-for="instrument in store.instruments"
                        :key="instrument"
                        :label="instrument"
                        :value="instrument"
                      />
                    </el-select> -->
    <el-button type="success" @click="emit('addMemberToGroup')">Добавить</el-button>
  </div>
</template>
