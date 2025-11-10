export interface User {
  _id: string
  username: string
  email: string
  role: string
  profile: {
    bio: string
    location: string
    favoriteGroups: Group[]
    favoriteAlbums: Albums[]
    website: string
  }
  stats: {
    contributions: number
    groupsAdded: number
    albumsAdded: number
    reviewsWritten: number
  }
  isVerified: boolean
  lastLogin: string
  preferences: {
    emailNotifications: boolean
    language: string
    theme: string
  }
}

export interface AuthData {
  username: string
  password: string
}

export interface RegisterData extends AuthData {
  email: string
  passwordConfirm?: string
}

export interface Album {
  _id?: string
  title: string
  description: string
  group: Group
  releaseDate: string
  genres: Genre[]
  type: 'full-length' | 'ep' | 'single' | 'demo' | 'live' | 'compilation' | 'split'
  cover: string
  label: string
  catalogId: string
  format: string
  tracks: TrackInfo[]
  socialLinks: SocialNetwork[]
  stats: {
    views: number
    likes: {
      _id: string
      username: string
    }[]
  }
  reviews: Review[]
  lineup: Member[]
  createdAt?: string
}

export interface TrackInfo {
  number: number
  title: string
  discNumber: number
  duration: string
  lyrics: string
  isInstrumental: boolean
}

export interface Group {
  _id?: string
  name: string
  description: string
  country: string[]
  city: string
  formedYear: number
  yearsActive: string
  status: 'active' | 'split-up' | 'on-hold' | 'unknown'
  genres: Genre[]
  themes: string[]
  logo: string
  banner: string
  socialLinks: SocialNetwork[]
  currentMembers: {
    member: Member
    roles: string[]
  }[]
  pastMembers: {
    member: Member
    roles: string[]
    years: string[]
  }[]
  stats: {
    views: number
    likes: {
      _id: string
      username: string
    }[]
    albumsCount: number
  }
}

export interface Genre {
  _id: string
  name: string
  description: string
  characteristics: string[]
}

export interface SocialNetwork {
  platform: 'website' | 'youtube' | 'bandcamp' | 'spotify' | 'facebook' | 'instagram' | 'twitter' | 'yandex' | 'vk'
  url: string
}

export interface Member {
  _id?: string
  name: string
  birthName: string // настоящее имя, если отличается
  birthDate: string
  birthPlace: string
  country: string
  bio: string
  photo: string // путь к фото
  instruments: string[]
  socialLinks: SocialNetwork[]
  status: 'active' | 'retired' | 'deceased'
}

export interface Country {
  name: string
  alpha2: string
  alpha3: string
}

export interface News {
  _id?: string
  title: string
  content: string
  author: User | string
  category: 'news' | 'review' | 'interview' | 'release'
  tags: string[]
  featuredImage: string
  relatedGroups: Group[]
  relatedAlbums: Album[]
  isPublished: boolean
  publishedAt: string
  views: number
}

export interface Review {
  _id?: string
  album: Album
  user: User
  plainText: string
  delta: string
  safeHTML: string
  rating: number
  isVerified: boolean
  verifiedUser: User | null
  views: number
  isEdit?: boolean // нужен только на фронте
}
