import '../_tools/before-test'

import * as path from 'path'
import {
  md5,
  fileMD5,
  imageType,
  getSize,
  getFilePath,
  saveFilesTmp,
  unoccupiedFile,
  flattenFiles,
  reext,
} from '../../common/file-utils'
import { IImageFile, SupportedExt } from '../../common/constants'

const relPath = (file: string) => path.resolve(__dirname, file)

test('md5', () => {
  expect(md5('123')).toBe('202cb962ac59075b964b07152d234b70')
})

test('fileMD5', async () => {
  const hash = await fileMD5(relPath('../_files/600_600.png'))
  expect(hash).toBe('d923e2f3e413a426af54a1535cb6d1ad')
})

test('imageType png', async () => {
  const { ext } = (await imageType(relPath('../_files/600_600.png')))!
  expect(ext).toBe('png')
})

test('imageType jpeg', async () => {
  const { ext } = (await imageType(relPath('../_files/fox.jpg')))!
  expect(ext).toBe('jpg')
})

test('getSize', async () => {
  const size = await getSize(relPath('../_files/600_600.png'))
  expect(size).toBe(40923)
})

test('getFilePath', async () => {
  const size = await getFilePath({
    id: 'abcd',
    url: '/',
    size: 0,
    ext: SupportedExt.png,
    originalName: '',
  })
  expect(size).toMatch(/\/abcd.png$/)
})

test('saveFilesTmp', async () => {
  const paths = [
    relPath('../_files/600_600.png'),
    relPath('../_files/fox.jpg'),
  ]

  const files = await saveFilesTmp(paths)

  expect((files[0] as IImageFile).ext).toBe('png')
  expect((files[1] as IImageFile).ext).toBe('jpg')
})

test('unoccupiedFile 1', async () => {
  const path0 = relPath('../_files/available.png')
  const pathExpect = path0
  const pathActual = await unoccupiedFile(path0)
  expect(pathActual).toBe(pathExpect)
})

test('unoccupiedFile 2', async () => {
  const path0 = relPath('../_files/qr.png')
  const pathExpect = relPath('../_files/qr(1).png')
  const pathActual = await unoccupiedFile(path0)
  expect(pathActual).toBe(pathExpect)
})

test('unoccupiedFile 3', async () => {
  const path0 = relPath('../_files/fox.jpg')
  const pathExpect = relPath('../_files/fox(2).jpg')
  const pathActual = await unoccupiedFile(path0)
  expect(pathActual).toBe(pathExpect)
})

test('unoccupiedFile 4', async () => {
  const path0 = relPath('../_files/firefox')
  const pathExpect = relPath('../_files/firefox(1)')
  const pathActual = await unoccupiedFile(path0)
  expect(pathActual).toBe(pathExpect)
})

test('flattenFiles', async () => {
  const sources = [
    '../_files/fox.jpg',
    '../_tools',
  ].map(relPath)

  const output = await flattenFiles(sources)
  expect(output).toEqual([
    '../_files/fox.jpg',
    '../_tools/before-test.ts',
    '../_tools/image-diff.ts',
  ].map(relPath))
})

test('reext', () => {
  expect(reext('a/b/c.png', SupportedExt.jpg)).toBe('a/b/c.jpg')
  expect(reext('a/b/c.jpg', SupportedExt.webp)).toBe('a/b/c.webp')
  expect(reext('a/b/c.old', SupportedExt.webp)).toBe('a/b/c.old.webp')
  expect(reext('a/b/c.PNG', SupportedExt.png)).toBe('a/b/c.PNG')
})
