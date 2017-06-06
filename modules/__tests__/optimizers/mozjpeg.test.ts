import * as path from 'path'
import { fullDiff } from '../_tools/image-diff'
import { tmpdir } from '../../common/file-utils'
import Mozjpeg from '../../optimizers/mozjpeg'

test('pngquant', async () => {
  const optimizer = new Mozjpeg({
    quality: 90,
  })
  const source = path.resolve(__dirname, '../_files/fox.jpg')
  const target = path.resolve(tmpdir, Date.now() + '_output_fox.jpg')

  await optimizer.io(source, target)

  const diffResult = await fullDiff({
    actualImage: target,
    expectedImage: source,
  })

  expect(diffResult.percentage).toBeLessThan(0.02)
})
