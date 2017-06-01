declare module 'read-chunk' {
  let readChunk: (filepath: string, pos: number, len: number) => Promise<Buffer>

  export = readChunk
}
