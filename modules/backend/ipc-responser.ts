import { BrowserWindow, ipcMain } from 'electron'
import { IElectronResponse, IpcChannel } from '../common/constants'
import log from 'electron-log'

export const listenIpc = <I, O>(channel: IpcChannel, responser: (input: I) => Promise<O> | O) => {
  ipcMain.on(channel, async (listener, sessionId: string, data: I) => {
    let result: O
    let error: Error

    try {
      result = await responser(data)
    } catch (err) {
      log.error(err)
      error = err
    }

    listener.sender.send(channel, {
      session: sessionId,
      error: error && error.message,
      result,
    } as IElectronResponse<O>)
  })
}
