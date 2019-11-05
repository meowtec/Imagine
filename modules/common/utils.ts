export const noop = () => {/* noop */}

export const coop = (min: number, max: number) => (num: number) => Math.min(max, Math.max(min, num))

export const coop2 = (min: number, max: number, num: number) => Math.min(max, Math.max(min, num))

export const randomId = () => Math.random().toString(36).slice(2)

export const shallowCompare = <T>(a: T, b: T, keys?: (keyof T)[]) => {
  if (a === b || (a == null && b == null)) {
    return true
  }

  if (typeof a !== 'object' || !a || typeof b !== 'object' || !b) {
      return false
  }

  if (!keys) {
    const akeys = Object.keys(a)
    const bkeys = Object.keys(b)

    if (akeys.length !== bkeys.length) {
      return false
    }

    keys = akeys as (keyof T)[]
  }

  for (const key of keys) {
    if (a[key] !== b[key]) {
      return false
    }
  }

  return true
}

export const sleep = (ms: number) => new Promise(resolve => {
  setTimeout(resolve, ms)
})

export const percent = (rate: number) => fixed((rate * 100), 1)

export const fixed = (number: number, digits: number) => Number(number.toFixed(digits))

type Unit = 'B' | 'KB' | 'MB'

export const size = (bytes: number): [number, Unit] => {
  let number: number
  let unit: Unit

  const k = 1024

  if (bytes < 1000) {
    number = bytes
    unit = 'B'
  } else if (bytes < 1000 * k) {
    number = fixed(bytes / k, 2)
    unit = 'KB'
  } else {
    number = fixed(bytes / k / k, 2)
    unit = 'MB'
  }

  return [number, unit]
}

export const unpick = <T extends {}, K extends keyof T>(obj: T, keys: K[]) => {
  const newObj: Partial<T> = {}

  for (const key in obj) {
    if (obj.hasOwnProperty(key) && keys.indexOf(key as any) === -1) {
      newObj[key] = obj[key]
    }
  }

  return newObj
}

export const cleanupArray = <T>(
  array: (T | null | undefined)[],
) => {
  return array.filter(x => x != null) as T[]
}
