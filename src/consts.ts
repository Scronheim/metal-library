import type { Album, Group, Member, User } from './types'

export const getDefaultAlbum = (): Album => {
  return {
    title: '',
    catalogId: '',
    cover: '',
    description: '',
    format: '',
    genres: [],
    group: {
      genres: []
    },
    socialLinks: [],
    label: '',
    releaseDate: '',
    stats: {
      likes: [],
      views: 0
    },
    tracks: [],
    type: 'full-length',
    lineup: [],
    reviews: []
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
    themes: [],
    yearsActive: ''
  }
}

export const getDefaultMember = (): Member => {
  return {
    bio: '',
    birthDate: '',
    birthName: '',
    birthPlace: '',
    country: '',
    discography: [],
    groups: [],
    instruments: [],
    name: '',
    photo: '',
    socialLinks: [],
    status: 'active'
  }
}

export const getDefaultUser = (): User => {
  return {
    id: '',
    email: '',
    isVerified: false,
    lastLogin: '',
    preferences: {
      emailNotifications: false,
      language: '',
      theme: ''
    },
    profile: {
      bio: '',
      favoriteAlbums: [],
      favoriteGroups: [],
      location: '',
      website: ''
    },
    role: '',
    stats: {
      albumsAdded: 0,
      contributions: 0,
      groupsAdded: 0,
      reviewsWritten: 0
    },
    username: ''
  }
}
