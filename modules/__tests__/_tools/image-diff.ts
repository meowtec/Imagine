import pixelmatch from 'pixelmatch'
import Jimp from 'jimp'

export const fullDiff = async ({
  actualImage,
  expectedImage,
}: {
  actualImage: string,
  expectedImage: string,
}) => {
  const img1 = await Jimp.read(actualImage)
  const img2 = await Jimp.read(expectedImage)
  const { width, height } = img1.bitmap

  const diffCount = pixelmatch(img1.bitmap.data, img2.bitmap.data, null, width, height, { threshold: 0.1 })
  return diffCount / (width * height)
}
