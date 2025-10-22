<script setup lang="ts">
import { ref, computed, type PropType } from 'vue'

import { useStore } from '@/stores/store'

import { getDefaultMember } from '@/consts'

import type { Member } from '@/types'

const store = useStore()

// Emits
const emit = defineEmits(['update:modelValue', 'add', 'update'])
// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  mode: {
    type: String,
    default: 'add',
    validator: (value: string) => ['add', 'edit'].includes(value)
  },
  member: {
    type: Object as PropType<Member>,
    required: true,
    default: getDefaultMember()
  }
})

// Computed
const visible = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})
// Refs
const rules = ref({
  name: [{ required: true, message: 'Введите имя', trigger: 'blur' }]
})
// Methods
const saveMember = () => {
  if (props.mode === 'add') emit('add')
  else emit('update')
  visible.value = false
}
</script>

<template>
  <el-dialog v-model="visible" :title="mode === 'add' ? 'Добавить участника' : 'Редактировать участника'" width="800px">
    <el-form ref="formRef" :model="member" :rules="rules" label-position="top">
      <el-card header="Основная информация" class="mb-2">
        <div class="grid grid-cols-3 gap-2">
          <el-form-item label="Сценическое имя" prop="name">
            <el-input v-model="props.member.name" placeholder="Введите сценическое имя" />
          </el-form-item>
          <el-form-item label="Настоящее имя" prop="birthName">
            <el-input v-model="props.member.birthName" placeholder="Введите настоящее имя" />
          </el-form-item>
          <el-form-item label="Дата рождения" prop="birthDate">
            <el-date-picker v-model="props.member.birthDate" type="date" placeholder="Выберите день" />
          </el-form-item>
        </div>
        <div class="grid grid-cols-3 gap-2">
          <el-form-item label="Страна" prop="birthPlace">
            <el-select v-model="props.member.country" placeholder="Выберите страну" filterable>
              <el-option
                v-for="country in store.countries"
                :key="country.alpha2"
                :label="country.name"
                :value="country.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Место рождения (город/деревня)" prop="birthPlace">
            <el-input v-model="props.member.birthPlace" placeholder="Введите место рождения" />
          </el-form-item>
          <el-form-item label="Статус" prop="status">
            <el-select v-model="props.member.status" placeholder="Выберите статус">
              <el-option label="Активен" value="active" />
              <el-option label="Уволен" value="retired" />
              <el-option label="RIP" value="deceased" />
              <el-option label="Неизвестно" value="unknown" />
            </el-select>
          </el-form-item>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <el-form-item label="Роли" prop="instruments">
            <el-select v-model="props.member.instruments" multiple placeholder="Выберите роль">
              <el-option
                v-for="instrument in store.instruments"
                :key="instrument"
                :label="instrument"
                :value="instrument"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Ссылка на фото" prop="bio">
            <el-input v-model="props.member.photo" placeholder="Введите URL" />
          </el-form-item>
        </div>
        <el-form-item label="Биография" prop="bio">
          <el-input type="textarea" :rows="8" v-model="props.member.bio" placeholder="Введите биографию" />
        </el-form-item>
      </el-card>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">Отмена</el-button>
      <el-button type="success" @click="saveMember">Сохранить</el-button>
    </template>
  </el-dialog>
</template>
