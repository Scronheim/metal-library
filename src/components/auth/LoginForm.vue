<template>
  <div class="login-container">
    <el-card class="login-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <h2>Вход в систему</h2>
        </div>
      </template>

      <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" @submit.prevent="handleLogin">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="Логин" size="large" :prefix-icon="User" />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="Пароль"
            size="large"
            show-password
            :prefix-icon="Lock"
            @keypress.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="authStore.isLoading"
            @click="handleLogin"
            class="login-button"
          >
            Войти
          </el-button>
        </el-form-item>
      </el-form>

      <div class="divider">
        <span>или войти через</span>
      </div>

      <div class="oauth-buttons">
        <el-button class="oauth-button google-button" @click="handleOAuth('google')" :disabled="authStore.isLoading">
          <img src="@/assets/google-icon.svg" alt="Google" class="oauth-icon" />
          Google
        </el-button>

        <el-button class="oauth-button github-button" @click="handleOAuth('github')" :disabled="authStore.isLoading">
          <img src="@/assets/github-icon.svg" alt="GitHub" class="oauth-icon" />
          GitHub
        </el-button>
      </div>

      <div class="register-link">
        <span>Нет аккаунта?</span>
        <el-link type="primary" @click="$emit('switch-to-register')">Зарегистрироваться</el-link>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Message, User, Lock } from '@element-plus/icons-vue'

import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const emit = defineEmits(['switch-to-register'])

const authStore = useAuthStore()
const loginFormRef = ref()

const loginForm = reactive({
  username: '',
  password: ''
})

const loginRules = {
  username: [{ required: true, message: 'Пожалуйста, введите логин', trigger: 'blur' }],
  password: [
    { required: true, message: 'Пожалуйста, введите пароль', trigger: 'blur' },
    { min: 6, message: 'Пароль должен быть не менее 6 символов', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    await loginFormRef.value.validate()
    const result = await authStore.login(loginForm)

    if (result.success) {
      ElMessage.success('Успешный вход!')
      router.push('/')
    } else {
      ElMessage.error(result.error)
    }
  } catch (error) {
    ElMessage.error('Ошибка валидации формы')
  }
}

const handleOAuth = provider => {
  authStore.initiateOAuth(provider)
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
}

.card-header {
  text-align: center;
}

.card-header h2 {
  margin: 0;
  color: #c1c1c1;
}

.login-button {
  width: 100%;
  margin-top: 10px;
}

.divider {
  display: flex;
  align-items: center;
  margin: 20px 0;
  color: #909399;
  font-size: 14px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #dcdfe6;
}

.divider::before {
  margin-right: 10px;
}

.divider::after {
  margin-left: 10px;
}

.oauth-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.oauth-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 12px;
}

.el-button + .el-button {
  margin-left: 0;
}

.oauth-icon {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.google-button {
  background-color: #bd392d;
  color: white;
}

.vk-button {
  background-color: #4c75a3;
  color: white;
}

.github-button {
  background-color: #333;
  color: white;
}

.register-link {
  display: flex;
  gap: 5px;
  justify-content: center;
  text-align: center;
  font-size: 14px;
}
</style>
