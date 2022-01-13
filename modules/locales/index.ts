import { app } from 'electron'
import createLocale, { GetText } from '../common/i18n'
import en from './en'
import zh from './zh-CN'
import nl from './nl'
import es from './es'
import fr from './fr'
import ar from './ar'
import it from './it'
import de from './de'
import sv from './sv'
import hr from './hr'
import sr from './sr'

const texts = {
  zh,
  en,
  nl,
  es,
  fr,
  ar,
  it,
  de,
  sv,
  hr,
  sr,
}

let gettext: GetText

// get os language in main or renderer
export const setup = () => {
  const locale = app?.getLocale() || navigator.language
  gettext = createLocale(texts, 'en', locale)
}

// renderer process: auto setup
// main process: should call setup on app ready
if (!app) {
  setup()
}

export default (key: string, ...args: any[]) => gettext(key, ...args)
