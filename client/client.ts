import omit from 'lodash/omit'
import * as settings from './settings'
import * as types from './types'

// https://fastapi.tiangolo.com/tutorial/handling-errors/
class Error {
  constructor(
    public code: number,
    public detail: string
  ) {}
}

export class Client {
  serverUrl?: string
  Error: typeof Error

  constructor(props: { serverUrl?: string } = {}) {
    this.serverUrl = props.serverUrl
    this.Error = Error
  }

  async readServerUrl() {
    return (
      this.serverUrl ||
      // @ts-ignore
      (await window?.opendataeditor?.readServerUrl()) ||
      settings.SERVER_URL
    )
  }

  async request<T>(
    path: string,
    props: { [key: string]: any; file?: File; isBytes?: boolean } = {}
  ) {
    const serverUrl = await this.readServerUrl()
    const response = await makeRequest(serverUrl + path, props)
    return response as T
  }

  // Article

  async articleCreate(props: { path: string; prompt?: string; deduplicate?: boolean }) {
    return await this.request<{ path: string }>('/article/create', props)
  }

  async articlePublish(props: { path: string; control: types.IControl }) {
    return await this.request<{ url?: string }>('/article/publish', props)
  }

  async articleRender(props: { path: string; text: string }) {
    return await this.request<{ text: string }>('/article/render', props)
  }

  // Chart

  async chartCreate(props: { path: string; prompt?: string; deduplicate?: boolean }) {
    return await this.request<{ path: string }>('/chart/create', props)
  }

  async chartEdit(props: { path: string; chart: types.IChart; prompt: string }) {
    return await this.request<{ chart: types.IChart }>('/chart/edit', props)
  }

  async chartRender(props: { path: string; chart: types.IChart }) {
    return await this.request<{ chart: types.IChart }>('/chart/render', props)
  }

  // Column

  async columnList() {
    return await this.request<{ columns: types.IColumn[] }>('/column/list')
  }

  // Config

  async configRead(props: Record<string, never> = {}) {
    return await this.request<{ config: types.IConfig }>('/config/read', props)
  }

  async configWrite(props: { config: types.IConfig }) {
    return await this.request<{ config: types.IConfig }>('/config/write', props)
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
    return await this.request<{ path: string }>('/file/create', props)
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
    return await this.request<{ path: string }>('/file/fetch', props)
  }

  async fileIndex(props: { path: string }) {
    return await this.request<{
      record: types.IRecord
      report: types.IReport
      measure: types.IMeasure
    }>('/file/index', props)
  }

  async fileList(props: { folder?: string } = {}) {
    return await this.request<{ files: types.IFile[] }>('/file/list', props)
  }

  async fileMove(props: { path: string; toPath?: string; deduplicate?: boolean }) {
    return await this.request<{ path: string }>('/file/move', props)
  }

  async filePatch(props: {
    path: string
    name?: string
    type?: string
    resource?: types.IResource
    toPath?: string
  }) {
    return await this.request<{ path: string }>('/file/patch', props)
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

  async folderMove(props: { path: string; toPath?: string; deduplicate?: boolean }) {
    return await this.request<{ path: string }>('/folder/move', props)
  }

  // Image

  async imageCreate(props: { path: string; prompt?: string; deduplicate?: boolean }) {
    return await this.request<{ path: string }>('/image/create', props)
  }

  // Json

  async jsonCreate(props: { path: string; data: types.IData; deduplicate?: boolean }) {
    return await this.request<{ path: string }>('/json/create', props)
  }

  async jsonEdit(props: { path: string; data: types.IData; prompt: string }) {
    return await this.request<{ data: types.IData }>('/json/edit', props)
  }

  async jsonPatch(props: {
    path: string
    data?: types.IData
    toPath?: string
    resource?: types.IResource
  }) {
    return await this.request<{ path: string }>('/json/patch', props)
  }

  async jsonRead(props: { path: string }) {
    return await this.request<{ data: any }>('/json/read', props)
  }

  // Map

  async mapCreate(props: { path: string; prompt?: string; deduplicate?: boolean }) {
    return await this.request<{ path: string }>('/map/create', props)
  }

  // Package

  async packageCreate(props: { path: string; prompt?: string; deduplicate?: boolean }) {
    return await this.request<{ path: string }>('/package/create', props)
  }

  async packageFetch(props: {
    url: string
    path?: string
    folder?: string
    deduplicate?: boolean
  }) {
    return await this.request<{ path: string }>('/package/fetch', props)
  }

  async packagePatch(props: { path: string; data?: types.IData; toPath?: string }) {
    return await this.request<{ path: string }>('/package/patch', props)
  }

  async packagePublish(props: { path: string; control: types.IControl }) {
    return await this.request<{ url: string }>('/package/publish', props)
  }

  // Project

  async projectOpen(props: { fullpath: string }) {
    return await this.request<Record<string, never>>('/project/open', props)
  }

  async projectSync(props: Record<string, never>) {
    return await this.request<{ files: types.IFile[] }>('/project/sync', props)
  }

  // Resource

  async resourcePatch(props: { path: string; data?: any; toPath?: string }) {
    return await this.request<{ path: string }>('/resource/patch', props)
  }

  // Script

  async scriptCreate(props: { path: string; prompt?: string; deduplicate?: boolean }) {
    return await this.request<{ path: string }>('/script/create', props)
  }

  async scriptExecute(props: { path: string; text: string }) {
    return await this.request<{ text: string }>('/script/execute', props)
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
    return await this.request<{ data: types.IView }>('/table/edit', props)
  }

  async tablePatch(props: {
    path: string
    toPath?: string
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

  async textCreate(props: {
    path: string
    text: string
    prompt?: string
    deduplicate?: boolean
  }) {
    return await this.request<{ path: string }>('/text/create', props)
  }

  async textEdit(props: { path: string; text: string; prompt: string }) {
    return await this.request<{ text: string }>('/text/edit', props)
  }

  async textPatch(props: {
    path: string
    text?: string
    resource?: types.IResource
    toPath?: string
  }) {
    return await this.request<{ path: string }>('/text/patch', props)
  }

  async textRead(props: { path: string; size?: number }) {
    return await this.request<{ text: string }>('/text/read', props)
  }

  // View

  async viewCreate(props: { path: string; prompt?: string; deduplicate?: boolean }) {
    return await this.request<{ path: string }>('/view/create', props)
  }

  async viewEdit(props: { path: string; data: types.IView; prompt: string }) {
    return await this.request<{ data: types.IView }>('/view/edit', props)
  }

  async viewInfer(props: { path: string }) {
    return await this.request<{ tableSchema?: types.ISchema }>('/view/infer', props)
  }

  async viewPatch(props: {
    path: string
    data?: types.IView
    toPath?: string
    resource?: types.IResource
  }) {
    return await this.request<{ path: string }>('/view/patch', props)
  }
}

// Internal

async function makeRequest(
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
  const result = isBytes ? { bytes: await response.arrayBuffer() } : await response.json()
  // console.log({ path, options, result })
  return result
}
