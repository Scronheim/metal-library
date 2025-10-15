<script setup lang="ts">
import { ref } from 'vue'
import { User } from '@element-plus/icons-vue'

import { useStore } from '@/stores/store'

import type { RegisterData } from '@/types'

const store = useStore()

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
  <el-popover placement="bottom" :width="250" trigger="click">
    <template #reference>
      <el-button :icon="User" circle />
    </template>
    <div v-if="store.userIsAuth" class="flex flex-col">
      <p class="font-bold">{{ store.user.username }}</p>
      <el-descriptions :column="1" title="Активность">
        <el-descriptions-item label="Групп">{{ store.user.stats.groupsAdded }}</el-descriptions-item>
        <el-descriptions-item label="Альбомов">{{ store.user.stats.albumsAdded }}</el-descriptions-item>
        <el-descriptions-item label="Обзоров">{{ store.user.stats.reviewsWritten }}</el-descriptions-item>
      </el-descriptions>
      <el-divider />
      <el-button tag="router-link" to="/groups/add">Добавить группу</el-button>
    </div>
    <div v-else>
      <el-form v-if="isRegister" ref="formRef" :model="registerData" label-position="top" label-width="auto">
        <el-form-item label="Имя" prop="username">
          <el-input v-model="registerData.username" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="registerData.email" />
        </el-form-item>
        <el-form-item label="Пароль" prop="password">
          <el-input type="password" v-model="registerData.password" />
        </el-form-item>
        <el-form-item label="Пароль ещё раз" prop="passwordConfirm">
          <el-input v-model="registerData.passwordConfirm" />
        </el-form-item>
        <el-button type="success" @click="isRegister = false">Войти</el-button>
        <el-button type="primary" @click="doRegister">Регистрация</el-button>
      </el-form>
      <el-form v-else ref="formRef" :model="authData" label-position="top" label-width="auto">
        <el-form-item label="Имя" prop="username">
          <el-input v-model="authData.username" />
        </el-form-item>
        <el-form-item label="Пароль" prop="password">
          <el-input type="password" v-model="authData.password" @keypress.enter="doLogin" />
        </el-form-item>
        <el-button type="success" @click="doLogin">Войти</el-button>
        <el-button type="primary" @click="isRegister = true">Регистрация</el-button>
      </el-form>
    </div>
  </el-popover>
</template>
