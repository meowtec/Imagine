declare module 'child-process-promise' {
  import { SpawnOptions, ChildProcess } from 'child_process'

  interface ChildProcessPromise extends Promise<{
    stdout: string,
    stderr: string,
  }> {
    childProcess: ChildProcess
  }

  export declare function spawn(
    command: string,
    args?: string[],
    options?: SpawnOptions & {capture?: string[]}): ChildProcessPromise
  // TODO: export declare function exec
}
