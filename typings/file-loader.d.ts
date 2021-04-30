declare module 'file-loader!*' {
  const value: string
  export = value
}

declare module '*.json' {
  const value: any
  export = value
}
