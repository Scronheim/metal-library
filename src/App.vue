<script setup lang="ts">
import { ref, computed } from 'vue'

import { useStore } from '@/stores/store'

import type { AuthData } from './types'

const store = useStore()

const authData = ref<AuthData>({
  username: '',
  password: ''
})

const levelImageSrc = computed((): string => {
  const levelGroup = Math.ceil(store.user.level / 5)
  return `/eft/images/levelgroups/${levelGroup}.png`
})
</script>

<template>
  <div class="flex items-center p-2 font-bold dark:bg-slate-600">
    <el-button tag="router-link" to="/" type="primary" text bg>Главная</el-button>
    <el-button tag="router-link" to="/quests" type="primary" text bg>Квесты</el-button>
    <el-button tag="router-link" to="/items" type="primary" text bg>Предметы</el-button>
  </div>
  <el-container>
    <el-aside width="240px" class="mt-6">
      <el-card v-if="store.userIsAuth">
        <template #header>
          <div class="flex flex-col items-center">
            <el-input v-model="store.user.nickname" placeholder="Ник персонажа" />
            <img :src="levelImageSrc" />
          </div>
        </template>
        <div class="flex flex-col">
          <p>Фракция</p>
          <el-select v-model="store.user.fraction" placeholder="Фракция" style="width: 200px">
            <template #prefix>
              <img :src="`/eft/images/${store.user.fraction}.webp`" width="20" />
            </template>
            <el-option label="BEAR" value="BEAR" />
            <el-option label="USEC" value="USEC" />
          </el-select>
        </div>
        <div class="flex flex-col">
          <p>Уровень</p>
          <el-input-number v-model.number="store.user.level" :min="1" :max="100" style="width: 200px" />
        </div>
        <div class="mb-5 flex flex-col">
          <p>Издание</p>
          <el-select v-model="store.user.gameEdition" placeholder="Издание" style="width: 200px">
            <el-option label="Standart" value="Standart" />
            <el-option label="Left Behind" value="Left behind" />
            <el-option label="Prepare for Escape" value="Prepare for Escape" />
            <el-option label="The Unheard" value="The Unheard" />
          </el-select>
        </div>
        <el-button type="danger" style="width: 100%" @click="store.logout">Выход</el-button>
      </el-card>
      <el-card v-else header="Авторизация">
        <div class="mb-3 flex flex-col gap-2">
          <el-input v-model="authData.username" placeholder="Логин" />
          <el-input v-model="authData.password" placeholder="Пароль" type="password" @keypress.enter="store.login(authData)" />
        </div>
        <div class="flex gap-1">
          <el-button type="success" text bg @click="store.login(authData)">Войти</el-button>
          <el-button type="primary" text bg @click="store.register(authData)">Регистрация</el-button>
        </div>
      </el-card>
    </el-aside>
    <el-main>
      <RouterView />
    </el-main>
  </el-container>
</template>

<style scoped>
.el-menu--horizontal {
  --el-menu-horizontal-height: 50px;
}
</style>
