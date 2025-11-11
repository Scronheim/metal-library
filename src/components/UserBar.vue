<script setup lang="ts">
import { User } from '@element-plus/icons-vue'

import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <el-popover v-if="authStore.userIsAuth" placement="bottom" :width="250" trigger="click">
    <template #reference>
      <el-button :icon="User" circle />
    </template>
    <div class="flex flex-col gap-2">
      <p class="font-bold">{{ authStore.user.username }}</p>
      <el-button tag="router-link" to="/profile">Профиль</el-button>
      <el-button v-if="authStore.userIsAdmin" tag="router-link" to="/group/add" style="width: 100%">
        Добавить группу
      </el-button>
    </div>
    <el-divider />
    <div class="flex flex-col">
      <el-button type="danger" @click="authStore.logout">Выход</el-button>
    </div>
  </el-popover>
  <template v-else>
    <el-button type="primary" tag="router-link" to="/auth">Войти</el-button>
  </template>
</template>

<style lang="css" scoped>
.el-button + .el-button {
  margin-left: 0px;
}
</style>
