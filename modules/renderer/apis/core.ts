import { ipcRenderer } from 'electron'
import { randomId } from '../../common/utils'
import { ElectronResponse } from '../../common/constants'

/**
 * create a [request - response] API
 * @param channel channel name
 */
export const requestCreater = <I, O>(channel: string) => (data: I) => new Promise<O>((resolve, reject) => {
  const sessionId = randomId()

  ipcRenderer.send(channel, sessionId, data)

  const handler = (event: Electron.IpcRendererEvent, { error, result, session }: ElectronResponse<O>) => {
    if (session !== sessionId) return

    if (error) {
      reject(new Error(error))
    } else {
      resolve(result)
    }

    ipcRenderer.removeListener(channel, handler)
  }

  ipcRenderer.on(channel, handler)
})
