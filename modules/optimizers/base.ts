import { Duplex } from 'stream'
import * as fs from 'fs-extra'
import * as rawBody from 'raw-body'
import { OptimizeOptions } from '../common/constants'

export default abstract class Optimizer {
  protected options: OptimizeOptions

  constructor (options: OptimizeOptions = {}) {
    this.options = options
  }

  abstract io (input: string, output: string): Promise<any>
}

export type OptimizerConstructor = {
  new (options: OptimizeOptions): Optimizer
}