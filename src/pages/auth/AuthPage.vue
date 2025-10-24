<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-forms">
        <LoginForm v-if="currentForm === 'login'" @switch-to-register="currentForm = 'register'" />
        <RegisterForm v-else @switch-to-login="currentForm = 'login'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import { useAuthStore } from '@/stores/auth'

import LoginForm from '@/components/auth/LoginForm.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'

const currentForm = ref('login')
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  // Обработка OAuth callback с параметрами в query string
  if (route.query.token || route.query.error) {
    if (route.query.token) {
      // Успешная авторизация
      const result = await authStore.handleOAuthSuccess(route.query.token, route.query.userId)

      if (result.success) {
        ElMessage.success('Успешная авторизация!')
        router.push('/')
      } else {
        router.push(`/auth/error?message=${encodeURIComponent(result.error)}`)
      }
    } else if (route.query.error) {
      // Ошибка авторизации
      router.push(`/auth/error?message=${route.query.error}`)
    }
  }
})
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.auth-forms {
  width: 100%;
  max-width: 400px;
}
</style>
