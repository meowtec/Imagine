/**
 * store / restore options using localStorage
 */

import { imagineAPI } from '../../bridge/web'
import { IDefaultOptions } from '../../common/types'

interface IStorageContent {
  defaultOptions: IDefaultOptions,
}

const key = 'options-v3'

const hasLocalStorage = !(typeof localStorage === 'undefined')

export const getOptions = () => {
  if (!hasLocalStorage) return null

  try {
    return JSON.parse(localStorage.getItem(key) ?? '') as IStorageContent
  } catch (e) {
    imagineAPI?.logger.error(`Failed to get options from localStorage, ${e}`)
    return null
  }
}

export const saveOptions = (options: IStorageContent) => {
  if (!hasLocalStorage) return

  try {
    localStorage.setItem(key, JSON.stringify(options))
  } catch (e) {
    imagineAPI?.logger.error(`Failed to set options to localStorage, ${e}`)
  }
}
