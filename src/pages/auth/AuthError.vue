<template>
  <div class="auth-error-page">
    <div class="error-container">
      <el-card class="error-card">
        <div class="error-icon">
          <el-icon size="64" color="#F56C6C"><CircleClose /></el-icon>
        </div>

        <h1>Ошибка авторизации</h1>
        <p class="error-description">{{ errorMessage }}</p>

        <div class="action-buttons">
          <el-button type="primary" @click="$router.push('/auth')" size="large">Попробовать снова</el-button>
          <el-button @click="$router.push('/')" size="large">На главную</el-button>
        </div>

        <div class="debug-info" v-if="debugInfo">
          <el-collapse>
            <el-collapse-item title="Техническая информация">
              <pre>{{ debugInfo }}</pre>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { CircleClose } from '@element-plus/icons-vue'

const route = useRoute()

const errorMessage = computed(() => {
  const message = route.query.message
  if (!message) return 'Произошла неизвестная ошибка при авторизации'

  // Расшифровка распространенных ошибок
  const errorMessages = {
    'Authentication failed': 'Ошибка аутентификации. Попробуйте еще раз.',
    'Unknown authentication strategy': 'Ошибка конфигурации сервера.',
    'Selected sign-in method not available for app': 'Метод входа недоступен для приложения.'
  }

  return errorMessages[message] || decodeURIComponent(message)
})

const debugInfo = computed(() => {
  if (process.env.NODE_ENV === 'development') {
    return {
      query: route.query,
      fullPath: route.fullPath
    }
  }
  return null
})

onMounted(() => {
  console.error('Auth error:', route.query.message)
})
</script>

<style scoped>
.auth-error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
  padding: 20px;
}

.error-container {
  width: 100%;
  max-width: 500px;
}

.error-card {
  text-align: center;
  padding: 40px 20px;
}

.error-icon {
  margin-bottom: 20px;
}

.error-card h1 {
  color: #f56c6c;
  margin-bottom: 16px;
}

.error-description {
  color: #606266;
  margin-bottom: 30px;
  font-size: 16px;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 20px;
}

.debug-info {
  margin-top: 20px;
  text-align: left;
}

.debug-info pre {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  font-size: 12px;
  overflow-x: auto;
}
</style>
