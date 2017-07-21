import { app } from 'electron'
import createLocale, { Gettext } from '../common/i18n'
import en_US from './en-US'
import zh_CN from './zh-CN'
import nl_NL from './nl-NL'
import fr_FR from './fr-FR'

const texts = {
  'zh-CN': zh_CN,
  'en-US': en_US,
  'nl-NL': nl_NL,
  'fr-FR': fr_FR
}

let gettext: Gettext

// get os language in main or renderer
export const setup = () => {
  const locale = app ? app.getLocale() : navigator.language
  gettext = createLocale(texts, {
    zh: 'zh-CN',
    nl: 'nl-NL',
    fr: 'fr-FR',
  }, 'en-US', locale)
}

// renderer process: auto setup
// main process: should call setup on app ready
if (!app) {
  setup()
}

export default (key: string, ...args: any[]) => gettext(key, ...args)
