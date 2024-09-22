import fs from 'fs'

export const readFileSync = (path: string): string =>
  fs.readFileSync(path, 'utf8')
