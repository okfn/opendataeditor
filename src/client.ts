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

  // Chart

  // TODO: provide proper type for chart
  async chartCreate(props: { path?: string; chart?: any } = {}) {
    const result = await this.request('/chart/create', props)
    return result as { path: string }
  }

  async chartRender(props: { chart: types.IChart }) {
    const result = await this.request('/chart/render', props)
    return result as { chart: types.IChart }
  }

  // Column

  async columnList() {
    const result = await this.request('/column/list')
    return result as { columns: types.IColumn[] }
  }

  // File

  async fileCopy(props: { path: string; toPath?: string; deduplicate?: boolean }) {
    const result = await this.request('/file/copy', props)
    return result as { path: string }
  }

  async fileCreate(props: {
    file: File
    name?: string
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

  async fileList() {
    const result = await this.request('/file/list')
    return result as { files: types.IFile[] }
  }

  async fileMove(props: {
    path: string
    toPath?: string
    newName?: string
    deduplicate?: boolean
  }) {
    const result = await this.request('/file/move', props)
    return result as { path: string }
  }

  async fileRead(props: { path: string }) {
    const result = await this.request('/file/read', { ...props, isBytes: true })
    return result as { bytes: ArrayBuffer }
  }

  // Folder

  async folderCreate(props: { path: string; folder?: string }) {
    const result = await this.request('/folder/create', props)
    return result as { path: string }
  }

  // Json

  async jsonRead(props: { path: string }) {
    const result = await this.request('/json/read', props)
    return result as { data: any }
  }

  async jsonWrite(props: { path: string; data: any; deduplicate?: boolean }) {
    const result = await this.request('/json/write', props)
    return result as { path: string }
  }

  // Link

  async linkFetch(props: {
    url: string
    path?: string
    folder?: string
    deduplicate?: boolean
  }) {
    const result = await this.request('/link/fetch', props)
    return result as { path: string }
  }

  // Metadata

  async metadataWrite(props: {
    path: string
    data: types.IResource | types.IDialect | types.ISchema
  }) {
    const result = await this.request('/metadata/write', props)
    return result as { path: string }
  }

  // Package

  async packageCreate(
    props: { path?: string; package?: types.IPackage; deduplicate?: boolean } = {}
  ) {
    const result = await this.request('/package/create', props)
    return result as { path: string }
  }

  async packagePublish(props: { path: string; control: types.ICkanControl }) {
    const result = await this.request('/package/publish', props)
    return result as { path: string }
  }

  async packageWrite(props: { path: string; data: types.IPackage }) {
    const result = await this.request('/package/write', props)
    return result as { path: string }
  }

  // Record

  async recordDelete(props: { path: string }) {
    const result = await this.request('/record/delete', props)
    return result as { record: types.IRecord }
  }

  async recordIndex(props: { path: string; sync?: boolean }) {
    const result = await this.request('/record/index', props)
    return result as { record: types.IRecord }
  }

  async recordRead(props: { path: string }) {
    const result = await this.request('/record/read', props)
    return result as { record: types.IRecord }
  }

  async recordSync(props: { path: string }) {
    const result = await this.request('/record/sync', props)
    return result as { record: types.IRecord }
  }

  async recordWrite(props: { path: string; type?: string; resource: types.IResource }) {
    const result = await this.request('/record/write', props)
    return result as { record: types.IRecord }
  }

  // Report

  async reportRead(props: { path: string }) {
    const result = await this.request('/report/read', props)
    return result as { report: types.IReport }
  }

  // Table

  async tableCount(props: { path: string; valid?: boolean }) {
    const result = await this.request('/table/count', props)
    return result as { count: number }
  }

  async tableExport(props: { path: string; toPath?: string }) {
    const result = await this.request('/table/export', props)
    return result as { path: string }
  }

  async tableQuery(props: { query: string }) {
    const result = await this.request('/table/query', props)
    return result as { table: types.ITable }
  }

  async tablePatch(props: { path: string; history: types.IHistory }) {
    const result = await this.request('/table/patch', props)
    return result as { path: string }
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

  async textRead(props: { path: string }) {
    const result = await this.request('/text/read', props)
    return result as { text: string }
  }

  async textRender(props: { text: string }) {
    const result = await this.request('/text/render', props)
    return result as { text: string }
  }

  async textWrite(props: { path: string; text: string }) {
    const result = await this.request('/text/write', props)
    return result as { path: string }
  }

  // View

  async viewCreate(props: { path?: string } = {}) {
    const result = await this.request('/view/create', props)
    return result as { path: string }
  }

  async viewWrite(props: { path: string; view: types.IView }) {
    const result = await this.request('/view/write', props)
    return result as { path: string }
  }
}

// Internal

async function makeRequest(
  path: string,
  props: { [key: string]: any; file?: File; isBytes?: boolean } = {}
) {
  const method = 'POST'
  let headers = {}
  let body
  if (props.file) {
    body = new FormData()
    body.append('file', new Blob([await props.file.arrayBuffer()]), props.file.name)
    for (const [name, value] of Object.entries(omit(props, 'file'))) {
      if (value === undefined) continue
      body.append(name, typeof value === 'string' ? value : JSON.stringify(value))
    }
  } else {
    headers = { 'Content-Type': 'application/json;charset=utf-8' }
    body = JSON.stringify(props)
  }
  const response = await fetch(path, { method, headers, body })
  const result = props.isBytes
    ? { bytes: await response.arrayBuffer() }
    : await response.json()
  console.log({ path, props, result })
  return result
}
