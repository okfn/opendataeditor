import * as settings from '@client/settings'
import { client } from '@client/client'
import { ISource } from '../state'
import * as store from '../store'

export async function loadSource() {
  const { path, record } = store.getState()
  if (!path || !record) return

  const source: ISource = {}
  const format = record.resource.format

  if (settings.BYTE_SOURCE_FORMATS.includes(format as any)) {
    source.bytes = await loadBytes(path)
  }

  if (settings.TEXT_SOURCE_FORMATS.includes(format as any)) {
    source.text = await loadText(path)
  }

  store.setState('load-source', (state) => {
    state.source = source
  })
}

async function loadBytes(path: string) {
  const result = await client.fileRead({ path, size: settings.MAX_SOURCE_SIZE })

  if (result instanceof client.Error) {
    store.setState('load-source-error', (state) => {
      state.error = result
    })
    return undefined
  }

  return result.bytes
}

async function loadText(path: string) {
  const result = await client.textRead({ path, size: settings.MAX_SOURCE_SIZE })

  if (result instanceof client.Error) {
    store.setState('load-source-error', (state) => {
      state.error = result
    })
    return undefined
  }

  return result.text
}
