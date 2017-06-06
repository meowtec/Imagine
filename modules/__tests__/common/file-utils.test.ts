import * as path from 'path'
import { md5, fileMD5, imageType, getSize, getFilePath, saveFilesTmp } from '../../common/file-utils'

const relPath = (file: string) => path.resolve(__dirname, file)

test('md5', () => {
  expect(md5('123')).toBe('202cb962ac59075b964b07152d234b70')
})

test('fileMD5', async () => {
  const hash = await fileMD5(relPath('../_files/600_600.png'))
  expect(hash).toBe('d923e2f3e413a426af54a1535cb6d1ad')
})

test('imageType png', async () => {
  const { ext } = await imageType(relPath('../_files/600_600.png'))
  expect(ext).toBe('png')
})

test('imageType jpeg', async () => {
  const { ext } = await imageType(relPath('../_files/fox.jpg'))
  expect(ext).toBe('jpg')
})

test('getSize', async () => {
  const size = await getSize(relPath('../_files/600_600.png'))
  expect(size).toBe(40923)
})

test('getFilePath', async () => {
  const size1 = await getFilePath({
    id: 'abcd',
    url: '/',
    size: 0,
    ext: 'png',
    originalName: '',
  }, {
    color: 3,
  })
  expect(size1).toMatch(/\/abcd_\w{6}.png$/)

  const size2 = await getFilePath({
    id: 'abcd',
    url: '/',
    size: 0,
    ext: 'png',
    originalName: '',
  })
  expect(size2).toMatch(/\/abcd.png$/)
})

test('saveFilesTmp', async () => {
  const paths = [
    relPath('../_files/600_600.png'),
    relPath('../_files/fox.jpg'),
  ]

  const files = await saveFilesTmp(paths)

  expect(files[0].ext).toBe('png')
  expect(files[1].ext).toBe('jpg')
})