import * as settings from '../settings'
import * as types from '../types'

export function exportDescriptor(descriptor: object) {
  const text = encodeURIComponent(JSON.stringify(descriptor, null, 2))
  return `data: text/json;charset=utf-8,${text}`
}

// TODO: cloneDeep here?
export function getInitialDescriptor(type?: string) {
  switch (type) {
    case 'package':
      return settings.INITIAL_PACKAGE
    case 'resource':
      return settings.INITIAL_RESOURCE
    case 'dialect':
      return settings.INITIAL_DIALECT
    case 'schema':
      return settings.INITIAL_SCHEMA
    default:
      return undefined
  }
}

export function generateTitle(items: any[], suffix: string = '') {
  let i = 0
  let exists = true
  let title: string
  while (true) {
    title = `${suffix}${i}`
    exists =
      items.filter((item) => item.title === title || item.name === title).length > 0
    if (!exists) break
    i++
  }
  return title
}

export function readHelpItem(help: types.IHelp, path: string): types.IHelpItem | null {
  const record = help[path]
  if (!record) return null
  return { path, title: record[0], link: record[1], description: record[2] }
}

export function bytesToBase64(bytes: ArrayBuffer): string {
  return btoa(
    new Uint8Array(bytes).reduce((data, byte) => data + String.fromCharCode(byte), '')
  )
}
