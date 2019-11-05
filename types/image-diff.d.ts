declare module 'image-diff' {
  namespace imageDiff {
    interface ImageDiffOptions {
      actualImage: string
      expectedImage?: string
      diffImage?: string
      shadow?: boolean,
    }

    interface ImageDiffFullResult {
      total:number
      percentage: number
    }

    interface ImageDiffStatic {
      (options: ImageDiffOptions, cb: (err: Error, imagesAreSame: boolean) => void): void
      getFullResult(options: ImageDiffOptions, cb: (err: Error, result: ImageDiffFullResult) => void): void
    }
  }

  const imageDiff: imageDiff.ImageDiffStatic
  export = imageDiff
}
