import omit from 'lodash/omit'
import { IResource } from './interfaces/resource'
import { IDetector } from './interfaces/detector'
import { ISession } from './interfaces/common'
import { IReport } from './interfaces/report'
import { IRecord } from './interfaces/record'
import { ITable } from './interfaces/table'
import { IPublish } from './interfaces/publish'
import { IFileItem } from './interfaces/common'

const DEFAULT_BASEPATH = '/api'

export class Client {
  session: ISession
  basepath: string

  constructor(props: { session: ISession; basepath?: string }) {
    this.session = props.session
    this.basepath = props.basepath || DEFAULT_BASEPATH
  }

  // TODO: read session from localStorage here?
  static async connect(props: { session?: ISession; basepath?: string } = {}) {
    const basepath = props.basepath || DEFAULT_BASEPATH
    const path = `${basepath}/project/connect`
    const data = await makeRequest(path, { session: props.session })
    const { session } = data as { session: ISession }
    return new this({ session, basepath })
  }

  async request(path: string, props: { [key: string]: any; file?: File } = {}) {
    if (this.basepath) path = this.basepath + path
    return makeRequest(path, { ...props, session: this.session })
  }

  // File

  async fileCopy(props: { source: string; target: string }) {
    const result = await this.request('/file/copy', props)
    return result as { path: string }
  }

  async fileCreate(props: { file: File; folder?: string }) {
    const result = await this.request('/file/create', props)
    return result as { path: string }
  }

  async fileCreateFolder(props: { name: string; folder?: string }) {
    const result = await this.request('/file/create-folder', props)
    return result as { path: string }
  }

  async fileDelete(props: { path: string }) {
    const result = await this.request('/file/delete', props)
    return result as { path: string }
  }

  async fileList() {
    const result = await this.request('/file/list')
    return result as { items: IFileItem[] }
  }

  async fileMove(props: { source: string; target: string }) {
    const result = await this.request('/file/move', props)
    return result as { path: string }
  }

  async fileRead(props: { path: string }) {
    const result = await this.request('/file/read', props)
    return result as { bytes: ArrayBuffer }
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

  // Resource

  async resourceCreate(props: { path: string }) {
    const result = await this.request('/resource/create', props)
    return result as { record: IRecord }
  }

  async resourceDelete(props: { path: string }) {
    const result = await this.request('/resource/delete', props)
    return result as { path: string }
  }

  async resourceDescribe(props: { path: string; detector?: IDetector }) {
    const result = await this.request('/resource/describe', props)
    return result as { resource: IResource }
  }

  async resourceExtract(props: { resource: IResource }) {
    const result = await this.request('/resource/extract', props)
    return result as { table: ITable }
  }

  async resourceList(props: {}) {
    const result = await this.request('/resource/list', props)
    // TODO: provide type
    return result as { records: any[] }
  }

  async resourceRead(props: { path: string }) {
    const result = await this.request('/resource/read', props)
    return result as { record: IRecord }
  }

  async resourceReadBytes(props: { path: string }) {
    const result = await this.request('/resource/read-bytes', props)
    return result as { bytes: ArrayBuffer }
  }

  async resourceReadData(props: { path: string }) {
    const result = await this.request('/resource/read-data', props)
    return result as { data: any }
  }

  async resourceReadText(props: { path: string }) {
    const result = await this.request('/resource/read-text', props)
    return result as { text: string }
  }

  async resourceTransform(props: { resource: IResource }) {
    const result = await this.request('/resource/transform', props)
    return result as { resource: IResource; table: ITable }
  }

  async resourceUpdate(props: { path: string }) {
    const result = await this.request('/resource/update', props)
    return result as { record: IRecord }
  }

  async resourceValidate(props: { resource: IResource }) {
    const result = await this.request('/resource/validate', props)
    return result as { report: IReport }
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
