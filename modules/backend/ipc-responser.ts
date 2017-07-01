import { BrowserWindow, ipcMain } from 'electron'
import { IElectronResponse, IpcChannel } from '../common/constants'
import log from 'electron-log'

export const listenIpc = <I, O>(channel: IpcChannel, responser: (input: I) => Promise<O> | O) => {
  ipcMain.on(channel, async (event: Electron.Event, sessionId: string, data: I) => {
    let result: O | null = null
    let error: Error | null = null

    try {
      result = await responser(data)
    } catch (err) {
      log.error(err)
      error = err
    }

    event.sender.send(channel, {
      session: sessionId,
      error: error && error.message,
      result,
    } as IElectronResponse<O>)
  })
}
