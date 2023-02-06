import omit from 'lodash/omit'
import { IPublish } from './interfaces/publish'
import { IFile, IFileItem } from './interfaces/file'
import { ITable, IQueryData } from './interfaces/table'
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

  async request(path: string, props: { [key: string]: any; file?: File } = {}) {
    if (this.basepath) path = this.basepath + path
    return makeRequest(path, { ...props, session: this.session })
  }

  // File

  async fileCount() {
    const result = await this.request('/file/count')
    return result as { count: number }
  }

  async fileCopy(props: { path: string; folder?: string }) {
    const result = await this.request('/file/copy', props)
    return result as { path: string }
  }

  async fileCreate(props: { file: File; folder?: string }) {
    const result = await this.request('/file/create', props)
    return result as { file: IFile }
  }

  async fileDelete(props: { path: string }) {
    const result = await this.request('/file/delete', props)
    return result as { path: string }
  }

  async fileList() {
    const result = await this.request('/file/list')
    return result as { items: IFileItem[] }
  }

  async fileMove(props: { path: string; folder: string }) {
    const result = await this.request('/file/move', props)
    return result as { path: string }
  }

  async fileRead(props: { path: string }) {
    const result = await this.request('/file/read', props)
    return result as { file: IFile }
  }

  async fileReadBytes(props: { path: string }) {
    const result = await this.request('/file/read-bytes', props)
    return result as { bytes: ArrayBuffer }
  }

  async fileReadTable(props: {
    path: string
    valid?: boolean
    limit?: number
    offset?: number
  }) {
    const result = await this.request('/file/read-table', props)
    return result as { table: ITable }
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

  async projectQuery(props: { query: string }) {
    const result = await this.request('/resource/query', props)
    return result as { data: IQueryData }
  }

  async projectQueryTable(props: { query: string }) {
    const result = await this.request('/resource/query-table', props)
    return result as { table: ITable }
  }
}

// Internal

async function makeRequest(
  path: string,
  props: { [key: string]: any; file?: File } = {}
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
  const result = await response.json()
  console.log({ path, props, result })
  return result
}
