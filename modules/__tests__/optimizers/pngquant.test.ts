import * as path from 'path'
import { fullDiff } from '../_tools/image-diff'
import { tmpdir } from '../../common/file-utils'
import { pngquant } from '../../optimizers/'

test('pngquant', async () => {
  const source = path.resolve(__dirname, '../_files/600_600.png')
  const target = path.resolve(tmpdir, Date.now() + '_output_600_600.png')

  await pngquant(source, target, {})

  const diffResult = await fullDiff({
    actualImage: target,
    expectedImage: source,
  })

  expect(diffResult.percentage).toBeLessThan(0.01)
})
