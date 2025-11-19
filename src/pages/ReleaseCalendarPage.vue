<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'

import { useStore } from '@/stores/store'

import type { Album } from '@/types'

const store = useStore()

// Refs
const calendar = ref()
const calendarOptions = ref({
  firstDay: 1,
  height: 800,
  locale: 'ru',
  plugins: [dayGridPlugin],
  initialView: 'dayGridMonth',
  buttonText: {
    today: 'Сегодня'
  },
  buttonHints: {
    prev: 'Предыдущий месяц',
    next: 'Следующий месяц'
  },
  events: []
})

// Methods
const getTooltipContent = (release): string => {
  return `
<div class="flex flex-col items-center">
<img width="200" src="${release.extendedProps.cover}">
${release.title}
</div>`
}

onMounted(async () => {
  console.log(calendar.value)

  calendarOptions.value.events = (await store.getReleaseCalendar()).map(r => {
    return {
      url: `/#/album/${r._id}`,
      title: `${r.title} (${r.groups.map(g => g.name).join('/')})`,
      cover: r.cover,
      start: new Date(r.releaseDate),
      end: new Date(r.releaseDate)
    }
  })
})
</script>

<template>
  <FullCalendar ref="calendar" :options="calendarOptions" style="background-color: #1e1e1e">
    <template v-slot:eventContent="{ event }">
      <el-tooltip effect="dark" :content="getTooltipContent(event)" raw-content>
        <b class="whitespace-normal">{{ event.title }}</b>
      </el-tooltip>
    </template>
  </FullCalendar>
</template>

<style scoped></style>
