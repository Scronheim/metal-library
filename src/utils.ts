import dayjs from 'dayjs'

export const formatDate = (date: string, format: string = 'DD.MM.YYYY'): string => {
  return dayjs(date).format(format)
}

export const textEllipsis = (str: string, maxLength: number = 100, { side = 'end', ellipsis = '...' } = {}): string => {
  if (str.length > maxLength) {
    switch (side) {
      case 'start':
        return ellipsis + str.slice(-(maxLength - ellipsis.length))
      case 'end':
      default:
        return str.slice(0, maxLength - ellipsis.length) + ellipsis
    }
  }
  return str
}
