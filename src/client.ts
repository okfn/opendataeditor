import omit from 'lodash/omit'
import { IPublish } from './interfaces/publish'
import { IFile, IFileItem } from './interfaces/file'
import { ITable, IQueryData } from './interfaces/table'
import { IFieldItem } from './interfaces/schema'
import { IData } from './interfaces/common'
import * as settings from './settings'

export class Client {
  basepath: string
  session?: string

  constructor(props: { basepath?: string; session?: string } = {}) {
    this.basepath = props.basepath || settings.DEFAULT_BASEPATH
    this.session = props.session
  }

  static async connect(props: { basepath?: string; session?: string } = {}) {
    const basepath = props.basepath || settings.DEFAULT_BASEPATH
    const path = `${basepath}/project/connect`
    const result = await makeRequest(path, { session: props.session })
    const session = result.session as string | undefined
    return new this({ basepath, session })
  }

  async request(
    path: string,
    props: { [key: string]: any; file?: File; isBytes?: boolean } = {}
  ) {
    if (this.basepath) path = this.basepath + path
    return makeRequest(path, { ...props, session: this.session })
  }

  // Bytes

  async bytesRead(props: { path: string }) {
    const result = await this.request('/bytes/read', { ...props, isBytes: true })
    return result as { bytes: ArrayBuffer }
  }

  // Data

  async dataRead(props: { path: string }) {
    const result = await this.request('/data/read', props)
    return result as { data: IData }
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

  async fileUpload(props: { file: File; folder?: string }) {
    const result = await this.request('/file/upload', props)
    return result as { path: string }
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
    const result = await this.request('/file/read', props)
    return result as { file?: IFile }
  }

  async fileRename(props: { path: string; name: string }) {
    const result = await this.request('/file/rename', props)
    return result as { path: string }
  }

  async fileUpdate(props: { path: string }) {
    const result = await this.request('/file/update', props)
    return result as { file: IFile }
  }

  // Folder

  async folderCreate(props: { name: string; folder?: string }) {
    const result = await this.request('/folder/create', props)
    return result as { path: string }
  }

  // Package

  async packageCreate() {
    const result = await this.request('/package/create')
    return result as { path: string }
  }

  async projectPublish(props: { params: IPublish }) {
    const result = await this.request('/project/publish-package', props)
    return result as { content: any }
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
  }) {
    const result = await this.request('/table/read', props)
    return result as { table: ITable }
  }

  // Text

  async textRead(props: { path: string }) {
    const result = await this.request('/text/read', props)
    return result as { text: string }
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
  const result = props.isBytes ? { bytes: await response.blob() } : await response.json()
  console.log({ path, props, result })
  return result
}
