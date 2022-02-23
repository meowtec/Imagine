import { toPairs } from 'lodash'

interface ILocaleTextsMap {
  [key: string]: {
    [key: string]: string
  }
}

export type GetText = (key: string, ...args: unknown[]) => string

// eg: en-US -> en
const macroLang = (langCode: string) => langCode.split(/-/)[0]

export default function createLocales(
  localeTextsMap: ILocaleTextsMap,
  defaultLang: string,
  lang: string,
) {
  const macroCode = macroLang(lang)

  // english
  const defaultTexts = localeTextsMap[defaultLang]

  const texts = (
    localeTextsMap[lang]
    || localeTextsMap[macroCode]
    || toPairs(localeTextsMap).find(([language]) => macroLang(language) === macroCode)?.[1]
    || defaultTexts
  )

  /**
   * get text by key
   * @param {string} key
   */
  return function get(key: string, ...args: any[]) {
    let content = texts[key] || defaultTexts[key] || key

    if (args.length) {
      args.forEach((arg, index) => {
        content = content.replace(new RegExp(`\\{${index}\\}`, 'g'), arg == null ? '' : arg)
      })
    }

    return content
  }
}
