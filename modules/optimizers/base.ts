import { Duplex } from 'stream'
import * as fs from 'fs-extra'
import * as rawBody from 'raw-body'
import { IOptimizeOptions } from '../common/constants'

export default abstract class Optimizer {
  protected options: IOptimizeOptions

  constructor(options: IOptimizeOptions = {}) {
    this.options = options
  }

  abstract io(input: string, output: string): Promise<any>
}

export interface IOptimizerConstructor {
  new (options: IOptimizeOptions): Optimizer
}
