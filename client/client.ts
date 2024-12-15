import * as settings from '@client/settings'
import { omit } from 'lodash'
import * as types from './types'

// https://fastapi.tiangolo.com/tutorial/handling-errors/
export class ClientError {
  constructor(public detail: string) {}
}

export class Client {
  Error = ClientError

  // Column

  async columnRename(props: { path: string; oldName: string; newName: string }) {
    return await makeRequest<Record<string, never>>('/column/rename', props)
  }

  // File

  async fileCopy(props: { path: string; toPath?: string; deduplicate?: boolean }) {
    return await makeRequest<{ path: string }>('/file/copy', props)
  }

  async fileCreate(props: {
    file: File
    path?: string
    folder?: string
    deduplicate?: boolean
  }) {
    return await makeRequest<{ path: string; size: number }>('/file/create', props)
  }

  async fileDelete(props: { path: string }) {
    return await makeRequest<{ path: string }>('/file/delete', props)
  }

  async fileFetch(props: {
    url: string
    path?: string
    folder?: string
    deduplicate?: boolean
  }) {
    return await makeRequest<{ path: string; size: number }>('/file/fetch', props)
  }

  async fileIndex(props: { path: string }) {
    return await makeRequest<{
      record: types.IRecord
      report: types.IReport
    }>('/file/index', props)
  }

  async fileList(props: { folder?: string } = {}) {
    return await makeRequest<{ files: types.IFile[] }>('/file/list', props)
  }

  async fileRename(props: { path: string; toPath?: string; deduplicate?: boolean }) {
    return await makeRequest<{ path: string }>('/file/move', props)
  }

  async filePublish(props: { path: string; control: types.IControl }) {
    return await makeRequest<{ url?: string }>('/file/publish', props)
  }

  async fileRead(props: { path: string; size?: number }) {
    return await makeRequest<{ bytes: ArrayBuffer }>('/file/read', {
      ...props,
      isBytes: true,
    })
  }

  // Folder

  async folderCopy(props: { path: string; toPath?: string; deduplicate?: boolean }) {
    return await makeRequest<{ path: string }>('/folder/copy', props)
  }

  async folderCreate(props: { path: string; folder?: string; deduplicate?: boolean }) {
    return await makeRequest<{ path: string }>('/folder/create', props)
  }

  async folderDelete(props: { path: string }) {
    return await makeRequest<{ path: string }>('/folder/delete', props)
  }

  async folderRename(props: { path: string; toPath?: string; deduplicate?: boolean }) {
    return await makeRequest<{ path: string }>('/folder/move', props)
  }

  // Table

  async tableCount(props: { path: string; valid?: boolean }) {
    return await makeRequest<{ count: number }>('/table/count', props)
  }

  async tableCreate(props: {
    path: string
    rows: types.IRow[]
    tableSchema: types.ISchema
    deduplicate?: boolean
  }) {
    return await makeRequest<{ path: string }>('/table/create', props)
  }

  async tableEdit(props: { path: string; text: string; prompt: string }) {
    return await makeRequest<{ text: string }>('/table/edit', props)
  }

  async tablePatch(props: {
    path: string
    history?: types.IHistory
    resource?: types.IResource
  }) {
    return await makeRequest<{ path: string }>('/table/patch', props)
  }

  async tableRead(props: {
    path: string
    valid?: boolean
    limit?: number
    offset?: number
    order?: string
    desc?: boolean
  }) {
    return await makeRequest<{ rows: types.IRow[] }>('/table/read', props)
  }

  async tableSuggest(props: { path: string; prompt: string; apiKey: string }) {
    return await makeRequest<{ text: string }>('/table/suggest', {
      ...props,
      timeoutMillis: 10_000,
    })
  }

  // Text

  async textRead(props: { path: string; size?: number }) {
    return await makeRequest<{ text: string }>('/text/read', props)
  }
}

export const client = new Client()

// Internal

async function makeRequest<T>(
  path: string,
  props: {
    [key: string]: any
    file?: File
    isBytes?: boolean
    timeoutMillis?: number
  } = {}
) {
  const { isBytes, timeoutMillis, ...options } = props

  let body
  let headers = {}
  const method = 'POST'
  const url = settings.SERVER_URL + path
  const signal = timeoutMillis ? AbortSignal.timeout(timeoutMillis) : undefined

  if (options.file) {
    body = new FormData()
    body.append('file', new Blob([await options.file.arrayBuffer()]), options.file.name)
    for (const [name, value] of Object.entries(omit(options, 'file'))) {
      if (value === undefined) continue
      body.append(name, typeof value === 'string' ? value : JSON.stringify(value))
    }
  } else {
    headers = { 'Content-Type': 'application/json;charset=utf-8' }
    body = JSON.stringify(options)
  }

  try {
    const response = await fetch(url, { method, headers, body, signal })

    // Success
    if (response.status === 200) {
      const data = isBytes
        ? { bytes: await response.arrayBuffer() }
        : await response.json()
      return data as T
    }

    // Error
    let data: any
    try {
      data = await response.json()
    } catch {}
    const message = data?.detail || `code (${response.status})`
    throw new Error(message)
  } catch (error: any) {
    const detail = error?.message || error.toString()
    return new ClientError(detail)
  }
}
