import { ref, computed, watch, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import { defineStore } from 'pinia'
import axios from 'axios'
import { ElNotification } from 'element-plus'
import { debounce } from 'lodash-es'
import { Link, VideoPlay, Headset, Camera, ChatLineRound, ChatLineSquare } from '@element-plus/icons-vue'

import type { User, AuthData, Group, Album, Genre, TrackInfo, Country } from '@/types'

export const useStore = defineStore('store', () => {
  const router = useRouter()

  // Refs
  const user = ref<User>({
    id: '',
    username: '',
    email: '',
    profile: {
      bio: '',
      location: '',
      favoriteAlbums: [],
      favoriteGroups: [],
      favoriteGenres: [],
      website: ''
    },
    role: '',
    stats: {
      groupsAdded: 0,
      albumsAdded: 0,
      contributions: 0,
      reviewsWritten: 0
    },
    isVerified: false,
    lastLogin: new Date(),
    preferences: {
      emailNotifications: false,
      language: 'ru',
      theme: 'dark'
    }
  })
  const token = ref<string | null>(localStorage.getItem('token'))
  const queryIsLoading = ref(false)
  const albumTypesMap = {
    'full-length': 'Студийный альбом',
    ep: 'EP',
    single: 'Сингл',
    demo: 'Демо',
    live: 'Концертный альбом',
    compilation: 'Сборник',
    split: 'Сплит'
  }
  const statusTypesMap = {
    active: 'Активна',
    'split-up': 'Распалась',
    'on-hold': 'На паузе',
    unknown: 'Неизвестно'
  }
  const albumTypeColorMap = {
    'full-length': 'danger',
    ep: 'warning',
    single: 'success',
    demo: 'info',
    live: 'primary',
    compilation: '',
    split: 'warning'
  }
  const socialLinkColorMap = {
    website: 'primary',
    youtube: 'danger',
    bandcamp: 'success',
    spotify: 'success',
    facebook: 'info',
    instagram: 'warning',
    twitter: 'info'
  }
  const socialLinkIconsMap = markRaw({
    website: Link,
    youtube: VideoPlay,
    bandcamp: Headset,
    spotify: Headset,
    facebook: ChatLineSquare,
    instagram: Camera,
    twitter: ChatLineRound
  })
  const socialPlatformNamesMap = {
    website: 'Сайт',
    youtube: 'YouTube',
    bandcamp: 'Bandcamp',
    spotify: 'Spotify',
    facebook: 'Facebook',
    instagram: 'Instagram',
    twitter: 'Twitter'
  }
  const countries: Country[] = [
    { name: 'Российская Федерация', alpha2: 'RU', alpha3: 'RUS' },
    { name: 'Киргизстан', alpha2: 'KG', alpha3: 'KGZ' },
    { name: 'Узбекистан', alpha2: 'UZ', alpha3: 'UZB' },
    { name: 'Донецкая Народная Республика', alpha2: 'DP', alpha3: 'DPR' },
    { name: 'Луганская Народная Республика', alpha2: 'LP', alpha3: 'LPR' },
    { name: 'Абхазия', alpha2: 'AB', alpha3: 'ABH' },
    { name: 'Афганистан', alpha2: 'AF', alpha3: 'AFG' },
    { name: 'Албания', alpha2: 'AL', alpha3: 'ALB' },
    { name: 'Алжир', alpha2: 'DZ', alpha3: 'DZA' },
    { name: 'Американское Самоа', alpha2: 'AS', alpha3: 'ASM' },
    { name: 'Андорра', alpha2: 'AD', alpha3: 'AND' },
    { name: 'Ангола', alpha2: 'AO', alpha3: 'AGO' },
    { name: 'Ангилья', alpha2: 'AI', alpha3: 'AIA' },
    { name: 'Антигуа и Барбуда', alpha2: 'AG', alpha3: 'ATG' },
    { name: 'Аргентина', alpha2: 'AR', alpha3: 'ARG' },
    { name: 'Армения', alpha2: 'AM', alpha3: 'ARM' },
    { name: 'Аруба', alpha2: 'AW', alpha3: 'ABW' },
    { name: 'Австралия', alpha2: 'AU', alpha3: 'AUS' },
    { name: 'Австрия', alpha2: 'AT', alpha3: 'AUT' },
    { name: 'Азербайджан', alpha2: 'AZ', alpha3: 'AZE' },
    { name: 'Багамы', alpha2: 'BS', alpha3: 'BHS' },
    { name: 'Бахрейн', alpha2: 'BH', alpha3: 'BHR' },
    { name: 'Бангладеш', alpha2: 'BD', alpha3: 'BGD' },
    { name: 'Барбадос', alpha2: 'BB', alpha3: 'BRB' },
    { name: 'Беларусь', alpha2: 'BY', alpha3: 'BLR' },
    { name: 'Бельгия', alpha2: 'BE', alpha3: 'BEL' },
    { name: 'Белиз', alpha2: 'BZ', alpha3: 'BLZ' },
    { name: 'Бенин', alpha2: 'BJ', alpha3: 'BEN' },
    { name: 'Бермуды', alpha2: 'BM', alpha3: 'BMU' },
    { name: 'Бутан', alpha2: 'BT', alpha3: 'BTN' },
    { name: 'Боливия', alpha2: 'BO', alpha3: 'BOL' },
    { name: 'Босния и Герцеговина', alpha2: 'BA', alpha3: 'BIH' },
    { name: 'Ботсвана', alpha2: 'BW', alpha3: 'BWA' },
    { name: 'Бразилия', alpha2: 'BR', alpha3: 'BRA' },
    { name: 'Британские Виргинские острова', alpha2: 'VG', alpha3: 'VGB' },
    { name: 'Бруней-Даруссалам', alpha2: 'BN', alpha3: 'BRN' },
    { name: 'Болгария', alpha2: 'BG', alpha3: 'BGR' },
    { name: 'Буркина-Фасо', alpha2: 'BF', alpha3: 'BFA' },
    { name: 'Бурунди', alpha2: 'BI', alpha3: 'BDI' },
    { name: 'Камбоджа', alpha2: 'KH', alpha3: 'KHM' },
    { name: 'Камерун', alpha2: 'CM', alpha3: 'CMR' },
    { name: 'Канада', alpha2: 'CA', alpha3: 'CAN' },
    { name: 'Кабо-Верде', alpha2: 'CV', alpha3: 'CPV' },
    { name: 'Центральноафриканская Республика', alpha2: 'CF', alpha3: 'CAF' },
    { name: 'Чад', alpha2: 'TD', alpha3: 'TCD' },
    { name: 'Чили', alpha2: 'CL', alpha3: 'CHL' },
    { name: 'Китай', alpha2: 'CN', alpha3: 'CHN' },
    { name: 'Гонконг', alpha2: 'HK', alpha3: 'HKG' },
    { name: 'Макао', alpha2: 'MO', alpha3: 'MAC' },
    { name: 'Колумбия', alpha2: 'CO', alpha3: 'COL' },
    { name: 'Коморы', alpha2: 'KM', alpha3: 'COM' },
    { name: 'Конго', alpha2: 'CG', alpha3: 'COG' },
    { name: 'Коста-Рика', alpha2: 'CR', alpha3: 'CRI' },
    { name: 'Кот-д’Ивуар', alpha2: 'CI', alpha3: 'CIV' },
    { name: 'Хорватия', alpha2: 'HR', alpha3: 'HRV' },
    { name: 'Куба', alpha2: 'CU', alpha3: 'CUB' },
    { name: 'Кипр', alpha2: 'CY', alpha3: 'CYP' },
    { name: 'Чешская Республика', alpha2: 'CZ', alpha3: 'CZE' },
    { name: 'Дания', alpha2: 'DK', alpha3: 'DNK' },
    { name: 'Джибути', alpha2: 'DJ', alpha3: 'DJI' },
    { name: 'Доминика', alpha2: 'DM', alpha3: 'DMA' },
    { name: 'Доминиканская Республика', alpha2: 'DO', alpha3: 'DOM' },
    { name: 'Эквадор', alpha2: 'EC', alpha3: 'ECU' },
    { name: 'Египет', alpha2: 'EG', alpha3: 'EGY' },
    { name: 'Сальвадор', alpha2: 'SV', alpha3: 'SLV' },
    { name: 'Экваториальная Гвинея', alpha2: 'GQ', alpha3: 'GNQ' },
    { name: 'Эритрея', alpha2: 'ER', alpha3: 'ERI' },
    { name: 'Эстония', alpha2: 'EE', alpha3: 'EST' },
    { name: 'Эфиопия', alpha2: 'ET', alpha3: 'ETH' },
    { name: 'Европейский Союз', alpha2: 'EU', alpha3: 'EUR' },
    { name: 'Фарерские острова', alpha2: 'FO', alpha3: 'FRO' },
    { name: 'Фиджи', alpha2: 'FJ', alpha3: 'FJI' },
    { name: 'Финляндия', alpha2: 'FI', alpha3: 'FIN' },
    { name: 'Франция', alpha2: 'FR', alpha3: 'FRA' },
    { name: 'Французская Гвиана', alpha2: 'GF', alpha3: 'GUF' },
    { name: 'Французская Полинезия', alpha2: 'PF', alpha3: 'PYF' },
    { name: 'Габон', alpha2: 'GA', alpha3: 'GAB' },
    { name: 'Гамбия', alpha2: 'GM', alpha3: 'GMB' },
    { name: 'Грузия', alpha2: 'GE', alpha3: 'GEO' },
    { name: 'Германия', alpha2: 'DE', alpha3: 'DEU' },
    { name: 'Гана', alpha2: 'GH', alpha3: 'GHA' },
    { name: 'Греция', alpha2: 'GR', alpha3: 'GRC' },
    { name: 'Гренландия', alpha2: 'GL', alpha3: 'GRL' },
    { name: 'Гренада', alpha2: 'GD', alpha3: 'GRD' },
    { name: 'Гваделупа', alpha2: 'GP', alpha3: 'GLP' },
    { name: 'Гуам', alpha2: 'GU', alpha3: 'GUM' },
    { name: 'Гватемала', alpha2: 'GT', alpha3: 'GTM' },
    { name: 'Гвинея-Бисау', alpha2: 'GW', alpha3: 'GNB' },
    { name: 'Гаити', alpha2: 'HT', alpha3: 'HTI' },
    { name: 'Гондурас', alpha2: 'HN', alpha3: 'HND' },
    { name: 'Венгрия', alpha2: 'HU', alpha3: 'HUN' },
    { name: 'Исландия', alpha2: 'IS', alpha3: 'ISL' },
    { name: 'Индия', alpha2: 'IN', alpha3: 'IND' },
    { name: 'Индонезия', alpha2: 'ID', alpha3: 'IDN' },
    { name: 'Иран (Исламская Республика)', alpha2: 'IR', alpha3: 'IRN' },
    { name: 'Ирак', alpha2: 'IQ', alpha3: 'IRQ' },
    { name: 'Ирландия', alpha2: 'IE', alpha3: 'IRL' },
    { name: 'Израиль', alpha2: 'IL', alpha3: 'ISR' },
    { name: 'Италия', alpha2: 'IT', alpha3: 'ITA' },
    { name: 'Япония', alpha2: 'JP', alpha3: 'JPN' },
    { name: 'Иордания', alpha2: 'JO', alpha3: 'JOR' },
    { name: 'Казахстан', alpha2: 'KZ', alpha3: 'KAZ' },
    { name: 'Кения', alpha2: 'KE', alpha3: 'KEN' },
    { name: 'Кирибати', alpha2: 'KI', alpha3: 'KIR' },
    { name: 'КНДР', alpha2: 'KP', alpha3: 'PRK' },
    { name: 'Республика Корея', alpha2: 'KR', alpha3: 'KOR' },
    { name: 'Кувейт', alpha2: 'KW', alpha3: 'KWT' },
    { name: 'Лаосская НДР', alpha2: 'LA', alpha3: 'LAO' },
    { name: 'Латвия', alpha2: 'LV', alpha3: 'LVA' },
    { name: 'Ливан', alpha2: 'LB', alpha3: 'LBN' },
    { name: 'Лесото', alpha2: 'LS', alpha3: 'LSO' },
    { name: 'Либерия', alpha2: 'LR', alpha3: 'LBR' },
    { name: 'Ливия', alpha2: 'LY', alpha3: 'LBY' },
    { name: 'Лихтенштейн', alpha2: 'LI', alpha3: 'LIE' },
    { name: 'Литва', alpha2: 'LT', alpha3: 'LTU' },
    { name: 'Люксембург', alpha2: 'LU', alpha3: 'LUX' },
    { name: 'Мадагаскар', alpha2: 'MG', alpha3: 'MDG' },
    { name: 'Малави', alpha2: 'MW', alpha3: 'MWI' },
    { name: 'Малайзия', alpha2: 'MY', alpha3: 'MYS' },
    { name: 'Мальдивы', alpha2: 'MV', alpha3: 'MDV' },
    { name: 'Мали', alpha2: 'ML', alpha3: 'MLI' },
    { name: 'Мальта', alpha2: 'MT', alpha3: 'MLT' },
    { name: 'Маршалловы острова', alpha2: 'MH', alpha3: 'MHL' },
    { name: 'Мартиника', alpha2: 'MQ', alpha3: 'MTQ' },
    { name: 'Мавритания', alpha2: 'MR', alpha3: 'MRT' },
    { name: 'Маврикий', alpha2: 'MU', alpha3: 'MUS' },
    { name: 'Мексика', alpha2: 'MX', alpha3: 'MEX' },
    { name: 'Микронезия (Федеративные Штаты)', alpha2: 'FM', alpha3: 'FSM' },
    { name: 'Молдова', alpha2: 'MD', alpha3: 'MDA' },
    { name: 'Монако', alpha2: 'MC', alpha3: 'MCO' },
    { name: 'Монголия', alpha2: 'MN', alpha3: 'MNG' },
    { name: 'Черногория', alpha2: 'ME', alpha3: 'MNE' },
    { name: 'Монтсеррат', alpha2: 'MS', alpha3: 'MSR' },
    { name: 'Марокко', alpha2: 'MA', alpha3: 'MAR' },
    { name: 'Мозамбик', alpha2: 'MZ', alpha3: 'MOZ' },
    { name: 'Мьянма', alpha2: 'MM', alpha3: 'MMR' },
    { name: 'Намибия', alpha2: 'NA', alpha3: 'NAM' },
    { name: 'Науру', alpha2: 'NR', alpha3: 'NRU' },
    { name: 'Непал', alpha2: 'NP', alpha3: 'NPL' },
    { name: 'Нидерланды', alpha2: 'NL', alpha3: 'NLD' },
    { name: 'Новая Каледония', alpha2: 'NC', alpha3: 'NCL' },
    { name: 'Новая Зеландия', alpha2: 'NZ', alpha3: 'NZL' },
    { name: 'Никарагуа', alpha2: 'NI', alpha3: 'NIC' },
    { name: 'Нигер', alpha2: 'NE', alpha3: 'NER' },
    { name: 'Нигерия', alpha2: 'NG', alpha3: 'NGA' },
    { name: 'Северные Марианские острова', alpha2: 'MP', alpha3: 'MNP' },
    { name: 'Норвегия', alpha2: 'NO', alpha3: 'NOR' },
    { name: 'Оман', alpha2: 'OM', alpha3: 'OMN' },
    { name: 'Пакистан', alpha2: 'PK', alpha3: 'PAK' },
    { name: 'Палау', alpha2: 'PW', alpha3: 'PLW' },
    { name: 'Палестинская территория', alpha2: 'PS', alpha3: 'PSE' },
    { name: 'Панама', alpha2: 'PA', alpha3: 'PAN' },
    { name: 'Папуа — Новая Гвинея', alpha2: 'PG', alpha3: 'PNG' },
    { name: 'Парагвай', alpha2: 'PY', alpha3: 'PRY' },
    { name: 'Перу', alpha2: 'PE', alpha3: 'PER' },
    { name: 'Филиппины', alpha2: 'PH', alpha3: 'PHL' },
    { name: 'Питкэрн', alpha2: 'PN', alpha3: 'PCN' },
    { name: 'Польша', alpha2: 'PL', alpha3: 'POL' },
    { name: 'Португалия', alpha2: 'PT', alpha3: 'PRT' },
    { name: 'Пуэрто-Рико', alpha2: 'PR', alpha3: 'PRI' },
    { name: 'Катар', alpha2: 'QA', alpha3: 'QAT' },
    { name: 'Реюньон', alpha2: 'RE', alpha3: 'REU' },
    { name: 'Румыния', alpha2: 'RO', alpha3: 'ROU' },
    { name: 'Руанда', alpha2: 'RW', alpha3: 'RWA' },
    { name: 'Сент-Китс и Невис', alpha2: 'KN', alpha3: 'KNA' },
    { name: 'Сент-Люсия', alpha2: 'LC', alpha3: 'LCA' },
    { name: 'Сент-Винсент и Гренадины', alpha2: 'VC', alpha3: 'VCT' },
    { name: 'Самоа', alpha2: 'WS', alpha3: 'WSM' },
    { name: 'Сан-Марино', alpha2: 'SM', alpha3: 'SMR' },
    { name: 'Сан-Томе и Принсипи', alpha2: 'ST', alpha3: 'STP' },
    { name: 'Саудовская Аравия', alpha2: 'SA', alpha3: 'SAU' },
    { name: 'Сенегал', alpha2: 'SN', alpha3: 'SEN' },
    { name: 'Сербия', alpha2: 'RS', alpha3: 'SRB' },
    { name: 'Сейшельские острова', alpha2: 'SC', alpha3: 'SYC' },
    { name: 'Сьерра-Леоне', alpha2: 'SL', alpha3: 'SLE' },
    { name: 'Сингапур', alpha2: 'SG', alpha3: 'SGP' },
    { name: 'Словакия', alpha2: 'SK', alpha3: 'SVK' },
    { name: 'Словения', alpha2: 'SI', alpha3: 'SVN' },
    { name: 'Соломоновы острова', alpha2: 'SB', alpha3: 'SLB' },
    { name: 'Сомали', alpha2: 'SO', alpha3: 'SOM' },
    { name: 'Южная Африка', alpha2: 'ZA', alpha3: 'ZAF' },
    { name: 'Испания', alpha2: 'ES', alpha3: 'ESP' },
    { name: 'Шри-Ланка', alpha2: 'LK', alpha3: 'LKA' },
    { name: 'Судан', alpha2: 'SD', alpha3: 'SDN' },
    { name: 'Суринам', alpha2: 'SR', alpha3: 'SUR' },
    { name: 'Эсватини', alpha2: 'SZ', alpha3: 'SWZ' },
    { name: 'Швеция', alpha2: 'SE', alpha3: 'SWE' },
    { name: 'Швейцария', alpha2: 'CH', alpha3: 'CHE' },
    { name: 'Сирийская Арабская Республика', alpha2: 'SY', alpha3: 'SYR' },
    { name: 'Тайвань', alpha2: 'TW', alpha3: 'TWN' },
    { name: 'Таджикистан', alpha2: 'TJ', alpha3: 'TJK' },
    { name: 'Танзания', alpha2: 'TZ', alpha3: 'TZA' },
    { name: 'Таиланд', alpha2: 'TH', alpha3: 'THA' },
    { name: 'Тимор-Лешти', alpha2: 'TL', alpha3: 'TLS' },
    { name: 'Того', alpha2: 'TG', alpha3: 'TGO' },
    { name: 'Тонга', alpha2: 'TO', alpha3: 'TON' },
    { name: 'Тринидад и Тобаго', alpha2: 'TT', alpha3: 'TTO' },
    { name: 'Тунис', alpha2: 'TN', alpha3: 'TUN' },
    { name: 'Турция', alpha2: 'TR', alpha3: 'TUR' },
    { name: 'Туркменистан', alpha2: 'TM', alpha3: 'TKM' },
    { name: 'Тувалу', alpha2: 'TV', alpha3: 'TUV' },
    { name: 'Уганда', alpha2: 'UG', alpha3: 'UGA' },
    { name: 'Украина', alpha2: 'UA', alpha3: 'UKR' },
    { name: 'Объединённые Арабские Эмираты', alpha2: 'AE', alpha3: 'ARE' },
    { name: 'Соединённое Королевство', alpha2: 'GB', alpha3: 'GBR' },
    { name: 'Соединённые Штаты Америки', alpha2: 'US', alpha3: 'USA' },
    { name: 'Уругвай', alpha2: 'UY', alpha3: 'URY' },
    { name: 'Вануату', alpha2: 'VU', alpha3: 'VUT' },
    { name: 'Венесуэла', alpha2: 'VE', alpha3: 'VEN' },
    { name: 'Вьетнам', alpha2: 'VN', alpha3: 'VNM' },
    { name: 'Виргинские острова (США)', alpha2: 'VI', alpha3: 'VIR' },
    { name: 'Йемен', alpha2: 'YE', alpha3: 'YEM' },
    { name: 'Замбия', alpha2: 'ZM', alpha3: 'ZMB' },
    { name: 'Зимбабве', alpha2: 'ZW', alpha3: 'ZWE' }
  ].sort((a, b) => {
    if (a.name < b.name) return -1
    else return 1
  })
  const availableGenres = ref<Genre[]>([])

  // Computed
  const userIsAuth = computed(() => !!token.value)
  const userIsAdmin = computed(() => user.value.role === 'admin')
  const availableYears = computed(() => Array.from({ length: 51 }, (_, i) => new Date().getFullYear() - i))

  // Methods
  async function updateLyrics(album: Album, track: TrackInfo, showNotification: boolean = false): Promise<void> {
    await axios.patch(`/library/api/albums/${album._id}/tracks/${track.number}/lyrics`, { track })
    if (showNotification)
      ElNotification({
        type: 'success',
        message: 'Текст трека успешно обновлен'
      })
  }
  async function updateAlbum(album: Album, showNotification: boolean = false): Promise<void> {
    await axios.put(`/library/api/albums/${album._id}`, album)
    if (showNotification)
      ElNotification({
        type: 'success',
        message: 'Альбом успешно обновлен'
      })
  }

  async function updateGroup(group: Group, showNotification: boolean = false): Promise<void> {
    await axios.put(`/library/api/groups/${group._id}`, group)
    if (showNotification)
      ElNotification({
        type: 'success',
        message: 'Группа успешно обновлена'
      })
  }

  async function addAlbum(album: Album, showNotification: boolean = false): Promise<void> {
    await axios.post('/library/api/albums', album)
    if (showNotification)
      ElNotification({
        type: 'success',
        message: 'Альбом успешно добавлен'
      })
  }

  async function addGroup(group: Group, showNotification: boolean = false): Promise<void> {
    await axios.post('/library/api/groups', group)
    if (showNotification)
      ElNotification({
        type: 'success',
        message: 'Группа успешно добавлена'
      })
  }

  async function searchGroup(searchQuery: string): Promise<{ data: { groups: Group[] } }> {
    return await axios.get(`/library/api/groups?search=${searchQuery}&limit=5`)
  }

  async function getGenres(): Promise<void> {
    const { data } = await axios.get('/library/api/genres')
    availableGenres.value = data
  }

  async function toggleLike(album: Album): Promise<{ newAlbum: Album; message: string }> {
    const { data } = await axios.patch(`/library/api/albums/${album._id}/like`)

    return {
      newAlbum: data.album,
      message: data.message
    }
  }

  async function aboutMe(): Promise<void> {
    const { data } = await axios.get('/library/api/auth/me')
    user.value = { ...data }
  }

  async function register(registerData: AuthData): Promise<void> {
    const { data } = await axios.post('/library/api/auth/register', { ...user.value, ...registerData })

    if (data) {
      user.value = data.user
      axios.defaults.headers.common['Authorization'] = data.token
      localStorage.setItem('token', data.token)
      token.value = data.token
      router.push('/')
      ElNotification({
        title: 'Успешно',
        message: 'Вы успешно зарегистрированы',
        type: 'success'
      })
    } else {
      ElNotification({
        title: 'Ошибка',
        message: data.message,
        type: 'error'
      })
    }
  }

  async function login(authData: AuthData): Promise<void> {
    try {
      const { data } = await axios.post('/library/api/auth/login', authData)
      if (data) {
        user.value = { ...user.value, ...data.user }
        axios.defaults.headers.common['Authorization'] = data.token
        localStorage.setItem('token', data.token)
        token.value = data.token
        router.push('/')
      } else {
        ElNotification({
          title: 'Ошибка',
          message: 'Вы ввели не правильный email или пароль',
          type: 'error'
        })
      }
    } catch {
      localStorage.removeItem('token')
    }
  }

  async function updateCurrentUser(showNotification: boolean = false): Promise<void> {
    await axios.patch('/library/api/update_user', user.value)
    if (showNotification) {
      ElNotification({
        title: 'Успешно',
        message: 'Пользователь сохранён',
        type: 'success'
      })
    }
  }

  function logout() {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    token.value = null
  }

  async function checkUserLoggedIn(): Promise<void> {
    if (token.value && !user.value.id) await aboutMe()
  }

  // watch(
  //   user,
  //   debounce(async () => {
  //     if (user.value.id) await updateCurrentUser()
  //   }, 500),
  //   { deep: true }
  // )

  return {
    user,
    queryIsLoading,
    userIsAuth,
    userIsAdmin,
    token,
    albumTypesMap,
    albumTypeColorMap,
    statusTypesMap,
    socialLinkColorMap,
    socialLinkIconsMap,
    socialPlatformNamesMap,
    countries,
    availableGenres,
    availableYears,
    checkUserLoggedIn,
    register,
    login,
    logout,
    aboutMe,
    searchGroup,
    updateAlbum,
    updateGroup,
    getGenres,
    toggleLike,
    updateLyrics,
    addGroup,
    addAlbum
  }
})
