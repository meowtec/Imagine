import { app } from 'electron'
import createLocale, { Gettext } from '../common/i18n'
import zh_CN from './zh-CN'
import en_US from './en-US'

const texts = {
  'zh-CN': zh_CN,
  'en-US': en_US,
}

let gettext: Gettext

// get os language in main or renderer
export const setup = () => {
  const locale = app ? app.getLocale() : navigator.language
  gettext = createLocale(texts, {}, 'en-US', locale)
}

// renderer will auto setup
// main process should call setup on app ready
if (!app) {
  setup()
}

export default (key: string, ...args: any[]) => gettext(key, ...args)
