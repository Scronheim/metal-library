<template>
  <v-card-title>Соц. сети</v-card-title>
  <v-row>
    <v-col v-for="type in socialTypes" :key="type.value">
      <v-text-field :label="type.title" v-model="bandsStore.currentBand.socials[type.value]"/>
    </v-col>
  </v-row>
</template>

<script setup>
//========== IMPORTS ==========
import { useBandsStore } from '@/stores/bands'
//========== STORES ==========
const bandsStore = useBandsStore()
//========== COMPUTED ==========

//========== VARIABLES ==========
const socialTypes = [
  { title: 'Bandcamp', value: 'bandcamp' },
  { title: 'Yandex Music', value: 'yaMusic' },
  { title: 'Spotify', value: 'spotify' },
  { title: 'Офф. сайт', value: 'officialSite' },
  { title: 'Youtube', value: 'youtube' },
  { title: 'Discogs', value: 'discogs' },
  { title: 'Facebook', value: 'facebook' },
  
]
//========== METHODS ==========

//========== ON MOUNTED ==========

</script>

<style scoped>

</style>
