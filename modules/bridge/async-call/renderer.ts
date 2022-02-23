import { ipcRenderer } from 'electron'
import { randomId } from '../../common/utils'
import { IElectronResponse, IpcChannel } from '../../common/types'

/**
 * make cross process method call easier.
 * the renderer side.
 *
 * usage:
 * ```
 * const methods = requestCreater<Arg, Result>(channalName)
 * let arg: Arg = {}
 * method(arg).then((result: Result) => {
 *   console.log(result)
 * })
 * ```
 *
 * @param channel channel name
 */

export const createAsyncCall = <I, O>(channel: IpcChannel) => (data?: I) => new Promise<O>((resolve, reject) => {
  const sessionId = randomId()

  ipcRenderer.send(channel, sessionId, data)

  const handler = (event: unknown, { error, result, session }: IElectronResponse<O>) => {
    if (session !== sessionId) return

    if (error) {
      reject(new Error(error))
    } else {
      resolve(result)
    }

    ipcRenderer.removeListener(IpcChannel.RESPONSE, handler)
  }

  ipcRenderer.on(IpcChannel.RESPONSE, handler)
})
