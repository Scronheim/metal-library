export interface Task {
  id: string
  name: string
  normalizedName: string
  trader: TaskTrader
  map: Map
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

export interface Map {
  name: string
  normalizedName: string
}

type ObjectiveType = 'visit' | 'findItem' | 'findQuestItem' | 'giveQuestItem' | 'giveItem' | 'extract' | 'mark' | 'skill' | 'shoot' | 'traderLevel'

export interface Objective {
  type: ObjectiveType
  description: string
  optional: boolean
  maps: Map[]
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

export interface User {
  level: number
  completedTasks: {
    [key: string]: number[]
  }
}
