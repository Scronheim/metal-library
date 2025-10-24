<script setup lang="ts">
import { ref } from 'vue'
import { User } from '@element-plus/icons-vue'

import { useAuthStore } from '@/stores/auth'

import type { RegisterData } from '@/types'

const store = useAuthStore()

const isRegister = ref<boolean>(false)
const authData = ref({
  username: '',
  password: ''
})
const registerData = ref<RegisterData>({
  username: '',
  password: '',
  passwordConfirm: '',
  email: ''
})

const doLogin = async () => {
  await store.login(authData.value)
}
const doRegister = async () => {
  await store.register(registerData.value)
}
</script>

<template>
  <el-popover v-if="store.userIsAuth" placement="bottom" :width="250" trigger="click">
    <template #reference>
      <el-button :icon="User" circle />
    </template>
    <div class="flex flex-col">
      <p class="font-bold">{{ store.user.username }}</p>
      <el-button tag="router-link" to="/groups/add">Добавить группу</el-button>
    </div>
  </el-popover>
  <template v-else>
    <el-button type="primary" tag="router-link" to="/auth">Войти</el-button>
  </template>
</template>
