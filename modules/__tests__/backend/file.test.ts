import * as path from 'path'
import { md5, fileMD5, imageType } from '../../common/file-utils'

test('md5', () => {
  expect(md5('123')).toBe('202cb962ac59075b964b07152d234b70')
})

test('fileMD5', async () => {
  const hash = await fileMD5(path.resolve(__dirname, '../_files/600_600.png'))
  expect(hash).toBe('d923e2f3e413a426af54a1535cb6d1ad')
})

test('imageType', async () => {
  const { ext } = await imageType(path.resolve(__dirname, '../_files/600_600.png'))
  expect(ext).toBe('png')
})