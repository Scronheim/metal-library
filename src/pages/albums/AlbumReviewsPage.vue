<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { useStore } from '@/stores/store'
import { useAuthStore } from '@/stores/auth'

import AlbumHero from '@/components/albums/AlbumHero.vue'
import ReviewForm from '@/components/albums/ReviewForm.vue'
import TextEditor from '@/components/TextEditor.vue'

import type { Review } from '@/types'

const store = useStore()
const authStore = useAuthStore()

// Refs
const reviews = ref<Review[]>([])
// Methods
const getReviews = async (): Promise<void> => {
  reviews.value = await store.getAlbumReviews()
}
const addReview = async (delta: string, safeHTML: string, plainText: string, rating: number): Promise<void> => {
  await store.addReview(delta, safeHTML, plainText, rating)
  await getReviews()
}

onMounted(async () => {
  await store.getAlbumById()
  await getReviews()
})
</script>

<template>
  <AlbumHero @update-album="store.getAlbumById" />
  <el-container class="review-main-content">
    <TextEditor v-if="authStore.userIsAuth" @save-content="addReview" />
    <ReviewForm v-for="review in reviews" :key="review._id" :review="review" />
  </el-container>
</template>

<style lang="css" scoped>
.review-main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  flex-direction: column;
}
</style>
