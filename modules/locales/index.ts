import { app } from 'electron'
import createLocale, { Gettext } from '../common/i18n'
import en_US from './en-US'
import zh_CN from './zh-CN'
import nl_NL from './nl-NL'
import es_ES from './es-ES'
import fr_FR from './fr-FR'
import ar_SA from './ar-SA'
import it_IT from './it-IT'
import de_DE from './de-DE'

const texts = {
  'zh-CN': zh_CN,
  'en-US': en_US,
  'nl-NL': nl_NL,
  'es-ES': es_ES,
  'fr-FR': fr_FR,
  'ar-SA': ar_SA,
  'it-IT': it_IT,
  'de-DE': de_DE,
}

let gettext: Gettext

// get os language in main or renderer
export const setup = () => {
  const locale = app ? app.getLocale() : navigator.language
  gettext = createLocale(texts, {
    zh: 'zh-CN',
    nl: 'nl-NL',
    es: 'es-ES',
    fr: 'fr-FR',
    ar: 'ar-SA',
    it: 'it-IT',
    de: 'de-DE',
  }, 'en-US', locale)
}

// renderer process: auto setup
// main process: should call setup on app ready
if (!app) {
  setup()
}

export default (key: string, ...args: any[]) => gettext(key, ...args)
