import { app } from 'electron'
import createLocale from '../common/i18n'
import zh_CN from './zh-CN'

const texts = {
  'zh-CN': zh_CN,
}

// get os language in main render or renderer
const locale = app ? app.getLocale() : navigator.language
export default createLocale(texts, {}, 'zh-CN', locale)
