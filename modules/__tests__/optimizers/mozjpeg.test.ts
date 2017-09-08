import * as path from 'path'
import { fullDiff } from '../_tools/image-diff'
import { tmpdir } from '../../common/file-utils'
import { mozjpeg } from '../../optimizers/'

test('pngquant', async () => {
  const source = path.resolve(__dirname, '../_files/fox.jpg')
  const target = path.resolve(tmpdir, Date.now() + '_output_fox.jpg')

  await mozjpeg(source, target, {
    quality: 90,
  })

  const diffResult = await fullDiff({
    actualImage: target,
    expectedImage: source,
  })

  expect(diffResult.percentage).toBeLessThan(0.02)
})
