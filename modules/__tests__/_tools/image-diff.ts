import pify from 'pify'
import { ImageDiffOptions, getFullResult, ImageDiffFullResult } from 'image-diff'

type FullDiff = (options: ImageDiffOptions) => Promise<ImageDiffFullResult>

export const fullDiff: FullDiff = pify(getFullResult)
