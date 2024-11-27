import omit from 'lodash/omit'
import * as types from './types'

// https://fastapi.tiangolo.com/tutorial/handling-errors/
export class ClientError {
  constructor(
    public status: number,
    public detail: string
  ) {}
}

export class Client {
  serverUrl?: string
  Error: typeof ClientError

  constructor() {
    this.serverUrl = 'http://localhost:4040'
    this.Error = ClientError
  }

  async request<T>(
    path: string,
    props: { [key: string]: any; file?: File; isBytes?: boolean } = {}
  ) {
    return await makeRequest<T>(this.serverUrl + path, props)
  }

  // Column

  async columnRename(props: { path: string; oldName: string; newName: string }) {
    return await this.request<Record<string, never>>('/column/rename', props)
  }

  // File

  async fileCopy(props: { path: string; toPath?: string; deduplicate?: boolean }) {
    return await this.request<{ path: string }>('/file/copy', props)
  }

  async fileCreate(props: {
    file: File
    path?: string
    folder?: string
    deduplicate?: boolean
  }) {
    return await this.request<{ path: string; size: number }>('/file/create', props)
  }

  async fileDelete(props: { path: string }) {
    return await this.request<{ path: string }>('/file/delete', props)
  }

  async fileFetch(props: {
    url: string
    path?: string
    folder?: string
    deduplicate?: boolean
  }) {
    return await this.request<{ path: string; size: number }>('/file/fetch', props)
  }

  async fileIndex(props: { path: string }) {
    return await this.request<{
      record: types.IRecord
      report: types.IReport
    }>('/file/index', props)
  }

  async fileList(props: { folder?: string } = {}) {
    return await this.request<{ files: types.IFile[] }>('/file/list', props)
  }

  async fileRename(props: { path: string; toPath?: string; deduplicate?: boolean }) {
    return await this.request<{ path: string }>('/file/move', props)
  }

  async filePublish(props: { path: string; control: types.IControl }) {
    return await this.request<{ url?: string }>('/file/publish', props)
  }

  async fileRead(props: { path: string; size?: number }) {
    return await this.request<{ bytes: ArrayBuffer }>('/file/read', {
      ...props,
      isBytes: true,
    })
  }

  // Folder

  async folderCopy(props: { path: string; toPath?: string; deduplicate?: boolean }) {
    return await this.request<{ path: string }>('/folder/copy', props)
  }

  async folderCreate(props: { path: string; folder?: string; deduplicate?: boolean }) {
    return await this.request<{ path: string }>('/folder/create', props)
  }

  async folderDelete(props: { path: string }) {
    return await this.request<{ path: string }>('/folder/delete', props)
  }

  async folderRename(props: { path: string; toPath?: string; deduplicate?: boolean }) {
    return await this.request<{ path: string }>('/folder/move', props)
  }

  // Package

  async packageFetch(props: {
    url: string
    path?: string
    folder?: string
    deduplicate?: boolean
  }) {
    return await this.request<{ path: string }>('/package/fetch', props)
  }

  async packagePublish(props: { path: string; control: types.IControl }) {
    return await this.request<{ url: string }>('/package/publish', props)
  }

  // Table

  async tableCount(props: { path: string; valid?: boolean }) {
    return await this.request<{ count: number }>('/table/count', props)
  }

  async tableCreate(props: {
    path: string
    rows: types.IRow[]
    tableSchema: types.ISchema
    deduplicate?: boolean
  }) {
    return await this.request<{ path: string }>('/table/create', props)
  }

  async tableEdit(props: { path: string; text: string; prompt: string }) {
    return await this.request<{ text: string }>('/table/edit', props)
  }

  async tablePatch(props: {
    path: string
    history?: types.IHistory
    resource?: types.IResource
  }) {
    return await this.request<{ path: string }>('/table/patch', props)
  }

  async tableRead(props: {
    path: string
    valid?: boolean
    limit?: number
    offset?: number
    order?: string
    desc?: boolean
  }) {
    return await this.request<{ rows: types.IRow[] }>('/table/read', props)
  }

  // Text

  async textRead(props: { path: string; size?: number }) {
    return await this.request<{ text: string }>('/text/read', props)
  }
}

export const client = new Client()

// Internal

async function makeRequest<T>(
  path: string,
  props: { [key: string]: any; file?: File; isBytes?: boolean } = {}
) {
  const { isBytes, ...options } = props
  const method = 'POST'
  let headers = {}
  let body

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

  const response = await fetch(path, { method, headers, body })
  const status = response.status

  try {
    if (status === 200) {
      const data = isBytes
        ? { bytes: await response.arrayBuffer() }
        : await response.json()
      return data as T
    } else if (status === 400) {
      const data = await response.json()
      return new ClientError(status, data.detail)
    } else {
      return new ClientError(status, DEFAULT_ERROR_DETAIL)
    }
  } catch (error) {
    const detail = error instanceof Error ? error.toString() : DEFAULT_ERROR_DETAIL
    return new ClientError(status, detail)
  }
}

const DEFAULT_ERROR_DETAIL = 'Unknown error'
