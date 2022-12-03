import omit from 'lodash/omit'
import { IResource } from './interfaces/resource'
import { IDetector } from './interfaces/detector'
import { ISession } from './interfaces/common'
import { IReport } from './interfaces/report'
import { IRecord } from './interfaces/record'
import { ITable } from './interfaces/table'

const DEFAULT_BASEPATH = '/api'

export class Client {
  session: ISession
  basepath: string

  constructor(props: { session: ISession; basepath?: string }) {
    this.session = props.session
    this.basepath = props.basepath || DEFAULT_BASEPATH
  }

  // Connect

  // TODO: read session from localStorage here?
  static async connect(props: { session?: ISession; basepath?: string } = {}) {
    const basepath = props.basepath || DEFAULT_BASEPATH
    const path = `${basepath}/project/connect`
    const data = await makeRequest(path, { session: props.session })
    const { session } = data as { session: ISession }
    return new this({ session, basepath })
  }

  // Request

  async request(path: string, props: { [key: string]: any; file?: File } = {}) {
    if (this.basepath) path = this.basepath + path
    return makeRequest(path, { ...props, session: this.session })
  }

  // Project

  async projectCreateFile(props: { file: File }) {
    const data = await this.request('/project/create-file', props)
    const { path } = data as { path: string }
    return { path }
  }

  async projectDeleteFile(props: { path: string }) {
    const data = await this.request('/project/delete-file', props)
    const { path } = data as { path: string }
    return { path }
  }

  async projectListFiles() {
    const data = await this.request('/project/list-files')
    const { paths } = data as { paths: string[] }
    return { paths }
  }

  async projectListFolders() {
    const data = await this.request('/project/list-folders')
    const { directories } = data as { directories: string[] }
    return { directories }
  }

  async projectCreatePackage() {
    const data = await this.request('/project/create-package')
    const { path } = data as { path: string }
    return { path }
  }

  async projectCreateRecord(props: { path: string }) {
    const data = await this.request('/project/create-record', props)
    const { record } = data as { record: IRecord }
    return { record }
  }

  async projectUpdateRecord(props: { resource: IResource }) {
    const data = await this.request('/project/update-record', props)
    const { record } = data as { record: IRecord }
    return { record }
  }

  async projectMoveFile(props: { filename: string; destination: string }) {
    const response = await this.request('/project/move-file', props)
    return { response }
  }

  async projectCreateDirectory(props: { directoryname: string }) {
    const response = await this.request('/project/create-directory', props)
    return { response }
  }

  async projectCopyFile(props: { filename: string }) {
    const response = await this.request('/project/copy-file', props)
    return { response }
  }

  // Resource

  async resourceDescribe(props: { path: string; detector?: IDetector }) {
    const response = await this.request('/resource/describe', props)
    const { resource } = response as { resource: IResource }
    return { resource }
  }

  async resourceExtract(props: { resource: IResource }) {
    const data = await this.request('/resource/extract', props)
    const { table } = data as { table: ITable }
    return { table }
  }

  async resourceReadBytes(props: { resource: IResource }) {
    const data = await this.request('/resource/read-bytes', props)
    const { bytes } = data as { bytes: string }
    return { bytes }
  }

  async resourceReadText(props: { resource: IResource }) {
    const data = await this.request('/resource/read-text', props)
    const { text } = data as { text: string }
    return { text }
  }

  async resourceReadData(props: { resource: IResource }) {
    const dt = await this.request('/resource/read-data', props)
    const { data } = dt as { data: object }
    return { data }
  }

  async resourceValidate(props: { resource: IResource }) {
    const data = await this.request('/resource/validate', props)
    const { report } = data as { report: IReport }
    return { report }
  }

  async resourceTransform(props: { resource: IResource }) {
    const data = await this.request('/resource/transform', props)
    const { resource, table } = data as { resource: IResource; table: ITable }
    return { resource, table }
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
      body.append(name, typeof value === 'string' ? value : JSON.stringify(value))
    }
  } else {
    headers = { 'Content-Type': 'application/json;charset=utf-8' }
    body = JSON.stringify(props)
  }
  const response = await fetch(path, { method, headers, body })
  const output = await response.json()
  console.log({ path, input: props, output })
  return output
}
