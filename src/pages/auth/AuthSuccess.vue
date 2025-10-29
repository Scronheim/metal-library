<template>
  <div class="auth-success-page">
    <div class="success-container">
      <el-card class="success-card">
        <div class="success-icon">
          <el-icon size="64" color="#67C23A"><CircleCheck /></el-icon>
        </div>

        <h1>Успешная авторизация!</h1>
        <p>Вы успешно вошли в систему. Перенаправляем вас...</p>

        <div class="loading-spinner" v-if="loading">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>Загрузка данных...</span>
        </div>

        <div class="error-message" v-if="error">
          <el-alert :title="error" type="error" show-icon :closable="false" />
          <el-button type="primary" @click="$router.push('/auth')" class="retry-button">Попробовать снова</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import { CircleCheck, Loading } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const loading = ref(true)
const error = ref('')

onMounted(async () => {
  const token = route.query.token
  const userId = route.query.userId

  if (!token) {
    error.value = 'Токен авторизации не получен'
    loading.value = false
    return
  }

  try {
    authStore.setAuthData({
      token,
      user: { _id: userId }
    })

    const success = await authStore.checkAuth()

    if (success) {
      ElMessage.success('Добро пожаловать!')

      setTimeout(() => {
        router.push('/')
      }, 1000)
    } else {
      throw new Error('Не удалось загрузить данные пользователя')
    }
  } catch (err) {
    console.error('Auth success error:', err)
    error.value = err.message || 'Произошла ошибка при авторизации'
    loading.value = false
  }
})
</script>

<style scoped>
.auth-success-page {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #121212;
  padding: 20px;
}

.success-container {
  width: 100%;
  max-width: 500px;
}

.success-card {
  text-align: center;
  padding: 40px 20px;
}

.success-icon {
  margin-bottom: 20px;
}

.success-card h1 {
  color: #67c23a;
  margin-bottom: 16px;
}

.success-card p {
  color: #606266;
  margin-bottom: 30px;
  font-size: 16px;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
}

.loading-spinner .el-icon {
  font-size: 24px;
}

.error-message {
  margin-top: 20px;
}

.retry-button {
  margin-top: 20px;
}
</style>
