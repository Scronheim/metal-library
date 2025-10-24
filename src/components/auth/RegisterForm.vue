<template>
  <div class="register-container">
    <el-card class="register-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <h2>Регистрация</h2>
        </div>
      </template>

      <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef" @submit.prevent="handleRegister">
        <el-form-item prop="username">
          <el-input v-model="registerForm.username" placeholder="Имя пользователя" size="large" :prefix-icon="User" />
        </el-form-item>

        <el-form-item prop="email">
          <el-input v-model="registerForm.email" placeholder="Email" size="large" :prefix-icon="Message" />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="Пароль"
            size="large"
            show-password
            :prefix-icon="Lock"
          />
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="Подтвердите пароль"
            size="large"
            show-password
            :prefix-icon="Lock"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="authStore.isLoading"
            @click="handleRegister"
            class="register-button"
          >
            Зарегистрироваться
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-link">
        <span>Уже есть аккаунт?</span>
        <el-link type="primary" @click="$emit('switch-to-login')">Войти</el-link>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { User, Message, Lock } from '@element-plus/icons-vue'

import { useAuthStore } from '@/stores/auth'

const emit = defineEmits(['switch-to-login'])

const authStore = useAuthStore()
const registerFormRef = ref()

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== registerForm.password) {
    callback(new Error('Пароли не совпадают'))
  } else {
    callback()
  }
}

const registerRules = {
  username: [
    { required: true, message: 'Пожалуйста, введите имя пользователя', trigger: 'blur' },
    { min: 3, max: 30, message: 'Имя пользователя должно быть от 3 до 30 символов', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Пожалуйста, введите email', trigger: 'blur' },
    { type: 'email', message: 'Введите корректный email', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Пожалуйста, введите пароль', trigger: 'blur' },
    { min: 6, message: 'Пароль должен быть не менее 6 символов', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: 'Пожалуйста, подтвердите пароль', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const handleRegister = async () => {
  if (!registerFormRef.value) return

  try {
    await registerFormRef.value.validate()

    const { confirmPassword, ...userData } = registerForm
    const result = await authStore.register(userData)

    if (result.success) {
      ElMessage.success('Регистрация успешна!')
      // Перенаправление или закрытие модального окна
    } else {
      ElMessage.error(result.error)
    }
  } catch (error) {
    ElMessage.error('Ошибка валидации формы')
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-card {
  width: 100%;
  max-width: 400px;
}

.card-header {
  text-align: center;
}

.card-header h2 {
  margin: 0;
  color: #333;
}

.register-button {
  width: 100%;
  margin-top: 10px;
}

.login-link {
  display: flex;
  justify-content: center;
  gap: 5px;
  text-align: center;
  font-size: 14px;
}
</style>
