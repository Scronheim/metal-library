export interface Task {
  id: string
  name: string
  normalizedName: string
  trader: TaskTrader
  map: GameMap
  experience: number
  taskImageLink: string
  minPlayerLevel: number
  objectives: Objective[]
  startRewards: TaskReward[]
  finishRewards: TaskReward[]
  kappaRequired: boolean
}

export interface TaskTrader {
  name: string
  normalizedName: string
}

export interface GameMap {
  name: string
  normalizedName: string
}

type ObjectiveType =
  | 'visit'
  | 'findItem'
  | 'findQuestItem'
  | 'giveQuestItem'
  | 'giveItem'
  | 'extract'
  | 'mark'
  | 'skill'
  | 'shoot'
  | 'traderLevel'

export interface Objective {
  type: ObjectiveType
  description: string
  optional: boolean
  maps: GameMap[]
  count?: number
  targetNames?: string[]
  trader?: Trader
  level?: number
}

export interface TaskReward {
  items: TaskItem[]
}

export interface TaskItem {
  count: number
  item: Item
}

export interface Item {
  name: string
  normalizedName: string
}

export interface Trader {
  name: string
  normalizedName: string
  tasks: Task[]
  trade: Item[]
}

type Fraction = 'BEAR' | 'USEC'
type GameEdition = 'Standart' | 'Left Behind' | 'Prepare for Escape' | 'The Unheard'

export interface User {
  nickname: string
  level: number
  fraction: Fraction
  gameEdition: GameEdition
  completedTasks: {
    id: string
    objectives: {
      index: number
      completed: boolean
      itemsNumber?: number
    }[]
    complete: boolean
  }[]
  trackingTasks: {
    [key: string]: {
      name: string
    }
  }
}
