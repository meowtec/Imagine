export const coop = (min: number, max: number) => (num: number) => Math.min(max, Math.max(min, num))

export const coop2 = (min: number, max: number, num: number) => Math.min(max, Math.max(min, num))

export const randomId = () => Math.random().toString(36).slice(2)

export const shallowCompare = <T>(a: T, b: T, keys?: (keyof T)[]) => {
  if (a === b) {
    return true
  }

  if (!keys) {
    const akeys = Object.keys(a)
    const bkeys = Object.keys(b)

    if (akeys.length !== bkeys.length) return false

    keys = <(keyof T)[]>akeys
  }

  for (let key of keys) {
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

const createQuene = () => {
  let prev: Promise<any> = Promise.resolve()

  return <T>(pthunk: () => Promise<T>) => {
    return prev = prev
      .catch(() => {})
      .then(pthunk)
  }
}
