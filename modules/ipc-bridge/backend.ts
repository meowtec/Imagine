import { ipcMain } from 'electron'
import log from 'electron-log'
import { IElectronResponse, IpcChannel } from '../common/types'

/**
 * make cross process method call easier.
 * the backend side.
 *
 * In main render there is a method whose type is:
 * ```
 * function backendMethod (arg: Arg): Promise<Result> | Result
 * ```
 *
 * We need call it in renderer process, so we should use `electron.rpc`
 * `ipc-bridge` provides a convenient way.
 *
 * usage:
 * ```
 * listenIpc<Arg, Result>(channelName, backendMethod)
 * ```
 *
 * Now we can call the method in renderer side. see renderer.ts for detail.
 *
 * @param channel channel name
 */

export const listenIpc = <I, O>(channel: IpcChannel, responser: (input: I) => Promise<O> | O) => {
  ipcMain.on(channel, async (event, sessionId: string, data: I) => {
    let result: O | null = null
    let error: Error | null = null

    try {
      result = await responser(data)
    } catch (err) {
      log.error(err)
      error = err as Error
    }

    event.sender.send(channel, {
      session: sessionId,
      error: error && error.message,
      result,
    } as IElectronResponse<O>)
  })
}
