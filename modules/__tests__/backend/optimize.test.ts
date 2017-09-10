import * as path from 'path'
import optimize from '../../backend/optimize'
import { saveFilesTmp, getFilePath } from '../../common/file-utils'
import { fullDiff } from '../_tools/image-diff'
import { IImageFile, SupportedExt } from '../../common/constants'

const relPath = (file: string) => path.resolve(__dirname, file)

const png = '../_files/600_600.png'
const jpg = '../_files/fox.jpg'

test('optimize png success', async () => {
  const files = await saveFilesTmp([relPath(png)])
  const file = files[0] as IImageFile
  const optimized = await optimize(file, {})

  const diffResult = await fullDiff({
    actualImage: getFilePath(optimized),
    expectedImage: getFilePath(file),
  })

  expect(diffResult.percentage).toBeLessThan(0.01)
})

test('optimize png fail', async () => {
  const image: IImageFile = {
    id: '404',
    url: '/',
    size: 0,
    ext: SupportedExt.png,
    originalName: '',
  }

  try {
    optimize(image, {})
  } catch (e) {
    expect(e).toBeTruthy()
  }
})

test('optimize jpg success', async () => {
  const files = await saveFilesTmp([relPath(jpg)])
  const file = files[0] as IImageFile
  const optimized = await optimize(file, {})

  const diffResult = await fullDiff({
    actualImage: getFilePath(optimized),
    expectedImage: getFilePath(file),
  })

  expect(diffResult.percentage).toBeLessThan(0.1)
})

test('optimize jpg fail', async () => {
  const image: IImageFile = {
    id: '404',
    url: '/',
    size: 0,
    ext: SupportedExt.jpg,
    originalName: '',
  }

  try {
    await optimize(image, {})
  } catch (e) {
    expect(e).toBeTruthy()
  }
})
