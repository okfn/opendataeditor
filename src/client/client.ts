import omit from 'lodash/omit'
import * as settings from './settings'
import * as types from './types'

export class Client {
  basepath: string

  constructor(props: { basepath?: string } = {}) {
    this.basepath = props.basepath || settings.DEFAULT_BASEPATH
  }

  async request(
    path: string,
    props: { [key: string]: any; file?: File; isBytes?: boolean } = {}
  ) {
    if (this.basepath) path = this.basepath + path
    return makeRequest(path, props)
  }

  // Article

  async articleCreate(props: { path: string; prompt?: string; deduplicate?: boolean }) {
    const result = await this.request('/article/create', props)
    return result as { path: string }
  }

  async articleRender(props: { path: string; text: string }) {
    const result = await this.request('/article/render', props)
    return result as { text: string }
  }

  // Chart

  async chartCreate(props: { path: string; prompt?: string; deduplicate?: boolean }) {
    const result = await this.request('/chart/create', props)
    return result as { path: string }
  }

  async chartEdit(props: { path: string; chart: types.IChart; prompt: string }) {
    const result = await this.request('/chart/edit', props)
    return result as { chart: types.IChart }
  }

  async chartRender(props: { path: string; chart: types.IChart }) {
    const result = await this.request('/chart/render', props)
    return result as { chart: types.IChart }
  }

  // Column

  async columnList() {
    const result = await this.request('/column/list')
    return result as { columns: types.IColumn[] }
  }

  // Config

  async configRead(props: {} = {}) {
    const result = await this.request('/config/read', props)
    return result as { config: types.IConfig }
  }

  async configWrite(props: { config: types.IConfig }) {
    const result = await this.request('/config/write', props)
    return result as { config: types.IConfig }
  }

  // File

  async fileCopy(props: { path: string; toPath?: string; deduplicate?: boolean }) {
    const result = await this.request('/file/copy', props)
    return result as { path: string }
  }

  async fileCreate(props: {
    file: File
    path?: string
    folder?: string
    deduplicate?: boolean
  }) {
    const result = await this.request('/file/create', props)
    return result as { path: string }
  }

  async fileDelete(props: { path: string }) {
    const result = await this.request('/file/delete', props)
    return result as { path: string }
  }

  async fileFetch(props: {
    url: string
    path?: string
    folder?: string
    deduplicate?: boolean
  }) {
    const result = await this.request('/file/fetch', props)
    return result as { path: string }
  }

  async fileIndex(props: { path: string }) {
    const result = await this.request('/file/index', props)
    return result as {
      record: types.IRecord
      report: types.IReport
      measure: types.IMeasure
    }
  }

  async fileList(props: { folder?: string } = {}) {
    const result = await this.request('/file/list', props)
    return result as { files: types.IFile[] }
  }

  async fileMove(props: { path: string; toPath?: string; deduplicate?: boolean }) {
    const result = await this.request('/file/move', props)
    return result as { path: string }
  }

  async filePatch(props: {
    path: string
    name?: string
    type?: string
    resource?: types.IResource
    toPath?: string
  }) {
    const result = await this.request('/file/patch', props)
    return result as { path: string }
  }

  async filePublish(props: { path: string; control: types.IControl }) {
    const result = await this.request('/file/publish', props)
    return result as { url?: string }
  }

  async fileRead(props: { path: string; size?: number }) {
    const result = await this.request('/file/read', { ...props, isBytes: true })
    return result as { bytes: ArrayBuffer }
  }

  // Folder

  async folderCopy(props: { path: string; toPath?: string; deduplicate?: boolean }) {
    const result = await this.request('/folder/copy', props)
    return result as { path: string }
  }

  async folderCreate(props: { path: string; folder?: string; deduplicate?: boolean }) {
    const result = await this.request('/folder/create', props)
    return result as { path: string }
  }

  async folderDelete(props: { path: string }) {
    const result = await this.request('/folder/delete', props)
    return result as { path: string }
  }

  async folderMove(props: { path: string; toPath?: string; deduplicate?: boolean }) {
    const result = await this.request('/folder/move', props)
    return result as { path: string }
  }

  // Image

  async imageCreate(props: { path: string; prompt?: string; deduplicate?: boolean }) {
    const result = await this.request('/image/create', props)
    return result as { path: string }
  }

  // Json

  async jsonCreate(props: { path: string; data: types.IData; deduplicate?: boolean }) {
    const result = await this.request('/json/create', props)
    return result as { path: string }
  }

  async jsonEdit(props: { path: string; data: types.IData; prompt: string }) {
    const result = await this.request('/json/edit', props)
    return result as { data: types.IData }
  }

  async jsonPatch(props: {
    path: string
    data?: types.IData
    toPath?: string
    resource?: types.IResource
  }) {
    const result = await this.request('/json/patch', props)
    return result as { path: string }
  }

  async jsonRead(props: { path: string }) {
    const result = await this.request('/json/read', props)
    return result as { data: any }
  }

  // Map

  async mapCreate(props: { path: string; prompt?: string; deduplicate?: boolean }) {
    const result = await this.request('/map/create', props)
    return result as { path: string }
  }

  // Package

  async packageCreate(props: { path: string; prompt?: string; deduplicate?: boolean }) {
    const result = await this.request('/package/create', props)
    return result as { path: string }
  }

  async packageFetch(props: {
    url: string
    path?: string
    folder?: string
    deduplicate?: boolean
  }) {
    const result = await this.request('/package/fetch', props)
    return result as { path: string }
  }

  async packagePatch(props: { path: string; data?: types.IData; toPath?: string }) {
    const result = await this.request('/package/patch', props)
    return result as { path: string }
  }

  async packagePublish(props: { path: string; control: types.IControl }) {
    const result = await this.request('/package/publish', props)
    return result as { url: string }
  }

  // Project

  async projectSync(props: {}) {
    const result = await this.request('/project/sync', props)
    return result as {}
  }

  // Resource

  async resourcePatch(props: { path: string; data?: any; toPath?: string }) {
    const result = await this.request('/resource/patch', props)
    return result as { path: string }
  }

  // Script

  async scriptCreate(props: { path: string; prompt?: string; deduplicate?: boolean }) {
    const result = await this.request('/script/create', props)
    return result as { path: string }
  }

  async scriptExecute(props: { path: string; text: string }) {
    const result = await this.request('/script/execute', props)
    return result as { text: string }
  }

  // Table

  async tableCount(props: { path: string; valid?: boolean }) {
    const result = await this.request('/table/count', props)
    return result as { count: number }
  }

  async tableCreate(props: {
    path: string
    rows: types.IRow[]
    tableSchema: types.ISchema
    deduplicate?: boolean
  }) {
    const result = await this.request('/table/create', props)
    return result as { path: string }
  }

  async tableEdit(props: { path: string; text: string; prompt: string }) {
    const result = await this.request('/table/edit', props)
    return result as { data: types.IView }
  }

  async tablePatch(props: {
    path: string
    toPath?: string
    history?: types.IHistory
    resource?: types.IResource
  }) {
    const result = await this.request('/table/patch', props)
    return result as { path: string }
  }

  async tableQuery(props: { query: string }) {
    const result = await this.request('/table/query', props)
    return result as { table: types.ITable }
  }

  async tableRead(props: {
    path: string
    valid?: boolean
    limit?: number
    offset?: number
    order?: string
    desc?: boolean
  }) {
    const result = await this.request('/table/read', props)
    return result as { rows: types.IRow[] }
  }

  // Text

  async textCreate(props: {
    path: string
    text: string
    prompt?: string
    deduplicate?: boolean
  }) {
    const result = await this.request('/text/create', props)
    return result as { path: string }
  }

  async textEdit(props: { path: string; text: string; prompt: string }) {
    const result = await this.request('/text/edit', props)
    return result as { text: string }
  }

  async textPatch(props: {
    path: string
    text?: string
    resource?: types.IResource
    toPath?: string
  }) {
    const result = await this.request('/text/patch', props)
    return result as { path: string }
  }

  async textRead(props: { path: string; size?: number }) {
    const result = await this.request('/text/read', props)
    return result as { text: string }
  }

  // View

  async viewCreate(props: { path: string; prompt?: string; deduplicate?: boolean }) {
    const result = await this.request('/view/create', props)
    return result as { path: string }
  }

  async viewEdit(props: { path: string; data: types.IView; prompt: string }) {
    const result = await this.request('/view/edit', props)
    return result as { data: types.IView }
  }

  async viewPatch(props: {
    path: string
    data?: types.IView
    toPath?: string
    resource?: types.IResource
  }) {
    const result = await this.request('/view/patch', props)
    return result as { path: string }
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
  console.log({ path, options, result })
  return result
}
