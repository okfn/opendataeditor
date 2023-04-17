import omit from 'lodash/omit'
import { ICkanControl } from './interfaces'
import { IFile, IFileItem } from './interfaces'
import { ITable, IQueryData } from './interfaces'
import { IFieldItem, IChart } from './interfaces'
import { IPackage, IResource, IDialect, ISchema, IView } from './interfaces'
import * as settings from './settings'

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

  async chartCreate() {
    const result = await this.request('/chart/create')
    return result as { path: string }
  }

  async chartRender(props: { chart: IChart }) {
    const result = await this.request('/chart/render', props)
    return result as { chart: IChart }
  }

  // Field

  async fieldList() {
    const result = await this.request('/field/list')
    return result as { items: IFieldItem[] }
  }

  // File

  async fileCopy(props: { path: string; folder?: string }) {
    const result = await this.request('/file/copy', props)
    return result as { path: string }
  }

  async fileCount() {
    const result = await this.request('/file/count')
    return result as { count: number }
  }

  async fileCreate(props: { path: string; folder?: string }) {
    const result = await this.request('/file/create', props)
    return result as { path: string; status: string; message: string }
  }

  async fileDelete(props: { path: string }) {
    const result = await this.request('/file/delete', props)
    return result as { path: string }
  }

  async fileIndex(props: { path: string }) {
    const result = await this.request('/file/index', props)
    return result as { file?: IFile }
  }

  async fileList() {
    const result = await this.request('/file/list')
    return result as { items: IFileItem[] }
  }

  async fileMove(props: { path: string; folder?: string }) {
    const result = await this.request('/file/move', props)
    return result as { path: string }
  }

  async fileRead(props: { path: string }) {
    const result = await this.request('/file/read', { ...props, isBytes: true })
    return result as { bytes: ArrayBuffer }
  }

  async fileRename(props: { path: string; name: string }) {
    const result = await this.request('/file/rename', props)
    return result as { path: string }
  }

  async fileSelect(props: { path: string }) {
    const result = await this.request('/file/select', props)
    return result as { file?: IFile }
  }

  async fileUpdate(props: { path: string; resource: IResource }) {
    const result = await this.request('/file/update', props)
    return result as { path: string }
  }

  async fileUpload(props: { file: File; folder?: string }) {
    const result = await this.request('/file/upload', props)
    return result as { path: string }
  }

  async fileWrite(props: { file: File; path: string }) {
    const result = await this.request('/file/write', props)
    return result as { path: string }
  }

  // Folder

  async folderCreate(props: { name: string; folder?: string }) {
    const result = await this.request('/folder/create', props)
    return result as { path: string }
  }

  // Json

  async jsonRead(props: { path: string }) {
    const result = await this.request('/json/read', props)
    return result as { data: any }
  }

  async jsonWrite(props: { path: string; data: any }) {
    const result = await this.request('/json/write', props)
    return result as { path: string }
  }

  // Metadata

  async metadataWrite(props: { path: string; data: IResource | IDialect | ISchema }) {
    const result = await this.request('/metadata/write', props)
    return result as { path: string }
  }

  // Package

  async packageCreate() {
    const result = await this.request('/package/create')
    return result as { path: string }
  }

  async packagePublish(props: { path: string; control: ICkanControl }) {
    const result = await this.request('/package/publish', props)
    return result as { path: string }
  }

  async packageWrite(props: { path: string; data: IPackage }) {
    const result = await this.request('/package/write', props)
    return result as { path: string }
  }

  // Project

  async projectIndex() {
    const result = await this.request('/project/index')
    return result as {}
  }

  async projectQuery(props: { query: string }) {
    const result = await this.request('/project/query', props)
    return result as { data: IQueryData }
  }

  // Table

  async tablePatch(props: { query: string }) {
    const result = await this.request('/table/patch', props)
    return result as { table: ITable }
  }

  async tableDownload(props: { path: string; name: string; format: string }) {
    const result = await this.request('/table/export', props)
    return result as { path: string }
  }

  async tableExport(props: { source: string; target: string }) {
    const result = await this.request('/table/export', props)
    return result as { path: string }
  }

  async tableQuery(props: { query: string }) {
    const result = await this.request('/table/query', props)
    return result as { table: ITable }
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
    return result as { table: ITable }
  }

  async tableWrite(props: { path: string; tablePatch: {}; folder?: string }) {
    const result = await this.request('/table/write', props)
    return result as { path: string; status: string; message: string }
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

  async viewCreate() {
    const result = await this.request('/view/create')
    return result as { path: string }
  }

  async viewWrite(props: { path: string; view: IView }) {
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
