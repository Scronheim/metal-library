export interface Item {
  _id: string
  name: string
  normalizedName: string
  shortName: string
  iconLink: string
  gridImageLink: string
  baseImageLink: string
  inspectImageLink: string
}

export interface Task {
  _id: string
  tarkovDevId: string
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
  itemsNumber?: number
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
  _id?: string
  username: string
  nickname: string
  level: number
  fraction: Fraction
  gameEdition: GameEdition
  completedTasks: {
    task: Pick<Task, '_id'>
    completedDate: Date
  }[]
  activeTasks: ActiveTask[]
}

export interface ActiveTask {
  task: Pick<Task, '_id'>
  objectives: {
    completed: boolean
    itemsNumber: number
  }[]
}

export interface AuthData {
  username: string
  password: string
}

export interface RegisterData extends User {
  password: string
}
