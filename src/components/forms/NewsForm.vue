<script setup lang="ts">
import { type PropType } from 'vue'
import { mdiAccountGroup, mdiAlbum } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'

import { formatDate, textEllipsis } from '@/utils'

import type { News } from '@/types'

const props = defineProps({
  news: {
    type: Object as PropType<News>,
    required: true
  },
  maxLength: {
    type: Number,
    default: 100
  },
  showReadButton: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <el-card>
    <template #header>
      <div class="flex justify-between">
        {{ news.title }}
        <div>{{ news.author.username }} ({{ formatDate(news.publishedAt, 'DD.MM.YYYY') }})</div>
      </div>
    </template>
    <div class="flex justify-start gap-2">
      <div>
        <el-image style="max-width: 400px" :src="news.featuredImage" />
      </div>
      <p>
        {{ textEllipsis(news.content, props.maxLength) }}
      </p>
    </div>
    <template #footer>
      <div class="flex justify-between items-center">
        <div class="flex flex-col">
          <div class="flex">
            <SvgIcon type="mdi" :path="mdiAccountGroup" :size="18" class="mr-2" />
            <template v-for="group in news.relatedGroups" :key="group._id">
              <router-link class="link" :to="`/group/${group._id}`">{{ group.name }}</router-link>
            </template>
          </div>
          <div v-if="news.relatedAlbums.length" class="flex">
            <SvgIcon type="mdi" :path="mdiAlbum" :size="18" class="mr-2" />
            <template v-for="album in news.relatedAlbums" :key="album._id">
              <router-link class="link" :to="`/album/${album._id}`">{{ album.title }}</router-link>
            </template>
          </div>
        </div>
        <div v-if="props.showReadButton">
          <el-button tag="router-link" :to="`/news/${news._id}`">Читать</el-button>
        </div>
      </div>
    </template>
  </el-card>
</template>

<style lang="css" scoped>
.link {
  font-weight: bold;
  color: #9e2a2a;
}
</style>
