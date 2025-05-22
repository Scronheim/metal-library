export const TASKS = `{
  tasks(lang: ru) {
    id
    name
    normalizedName
    trader {
      name
      normalizedName
    }
    map {
      name
      normalizedName
    }
    experience
    taskImageLink
    minPlayerLevel
    objectives {
      type
      description
      optional
      ...on TaskObjectiveItem {
        count
      }
      ...on TaskObjectiveShoot {
        targetNames
        count
      }
      ...on TaskObjectiveExtract {
        maps {
          name
          normalizedName
        }
        count
      }
      ...on TaskObjectiveTraderLevel {
        trader {
          name
          normalizedName
        }
        level
      }
      maps {
        name
        normalizedName
      }
    }
    startRewards {
      items {
        item {
          name
          normalizedName
        }
        count
      }
    }
    finishRewards {
      items {
        item {
          name
          normalizedName
        }
        count
      }
    }
    kappaRequired
  }
}`
