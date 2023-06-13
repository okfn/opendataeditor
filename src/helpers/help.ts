import * as types from '../types'

export function readHelpItem(help: types.IHelp, path: string): types.IHelpItem | null {
  const record = help[path]
  if (!record) return null
  return { path, title: record[0], link: record[1], description: record[2] }
}
