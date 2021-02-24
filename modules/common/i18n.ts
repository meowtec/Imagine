interface ILocalesTexts {
  [key: string]: {
    [key: string]: string
  }
}

interface IMacroMap {
  [key: string]: string
}

export type Gettext = (key: string, ...args: any[]) => string

// eg: en-US -> en
const macrolang = (langCode: string) => langCode.split('-')[0]

export default function createLocales(
  locales: ILocalesTexts,
  macroMap: IMacroMap,
  defaultLang: string,
  locale: string,
) {
  const macroCode = macrolang(locale)
  const defaultMacro = macroMap && macroMap[macroCode]

  const defaults = locales[defaultLang]
  const macroTexts = locales[macroCode] || locales[defaultMacro] || defaults
  const texts = locales[locale] || macroTexts

  if (!defaults) throw new Error('Invalid default language')

  /**
   * get text by key
   * @param {string} key
   */
  return function get(key: string, ...args: any[]) {
    let content = texts[key] || macroTexts[key] || defaults[key] || key

    if (args.length) {
      args.forEach((arg, index) => {
        content = content.replace(new RegExp(`\\{${index}\\}`, 'g'), arg == null ? '' : arg)
      })
    }

    return content
  }
}
