import type { Album, Group } from './types'

export const getDefaultAlbum = (): Album => {
  return {
    title: '',
    catalogId: '',
    cover: '',
    description: '',
    format: '',
    genres: [],
    group: {},
    label: '',
    releaseDate: '',
    releaseYear: new Date().getFullYear(),
    stats: {
      likes: [],
      views: 0
    },
    tracks: [],
    type: 'full-length'
  }
}

export const getDefaultGroup = (): Group => {
  return {
    name: '',
    country: '',
    city: '',
    banner: '',
    logo: '',
    description: '',
    genres: [],
    formedYear: new Date().getFullYear(),
    currentMembers: [],
    pastMembers: [],
    socialLinks: [],
    stats: {
      albumsCount: 0,
      likes: [],
      views: 0
    },
    status: 'active',
    themes: []
  }
}
