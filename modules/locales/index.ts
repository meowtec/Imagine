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
import fa from './fa'
import ru from './ru'

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
  fa,
  ru,
}

let gettext: GetText

// get os language in main or renderer
export const setup = (locale: string) => {
  gettext = createLocale(texts, 'en', locale)
}

export default (key: string, ...args: unknown[]) => gettext(key, ...args)
