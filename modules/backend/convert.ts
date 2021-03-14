import Jimp from 'jimp'

export default function imageConvert(sourceFile: string, targetFile: string) {
  return Jimp.read(sourceFile).then((image) => image.write(targetFile))
}
