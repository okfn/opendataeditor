import omit from 'lodash/omit'
import { IResource } from './interfaces/resource'
import { IDetector } from './interfaces/detector'
import { ISession } from './interfaces/common'
import { IReport } from './interfaces/report'
import { ITable } from './interfaces/table'

export class Client {
  basepath: string = '/api'

  async request(path: string, props: { [key: string]: any; file?: File } = {}) {
    if (this.basepath) path = this.basepath + path
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
    return response.json()
  }

  // Project

  async projectCreate() {
    const data = await this.request('/project/create')
    const { session } = data as { session: string }
    return { session }
  }

  async projectCreateFile(props: { session?: ISession; file: File }) {
    const data = await this.request('/project/create-file', props)
    const { path } = data as { path: string }
    return { path }
  }

  async projectDeleteFile(props: { session?: ISession; path: string }) {
    const data = await this.request('/project/delete-file', props)
    const { path } = data as { path: string }
    return { path }
  }

  async projectListFiles(props: { session?: ISession }) {
    const data = await this.request('/project/list-files', props)
    const { paths } = data as { paths: string[] }
    return { paths }
  }

  async projectReadFile(props: { session?: ISession; path: string }) {
    const data = await this.request('/project/read-file', props)
    const { text } = data as { text: string }
    return { text }
  }

  // Resource

  async resourceDescribe(props: {
    session?: ISession
    path: string
    detector?: IDetector
  }) {
    const response = await this.request('/resource/describe', props)
    const { resource } = response as { resource: IResource }
    return { resource }
  }

  async resourceExtract(props: { session?: ISession; resource: IResource }) {
    const data = await this.request('/resource/extract', props)
    const { table } = data as { table: ITable }
    return { table }
  }

  async resourceValidate(props: { session?: ISession; resource: IResource }) {
    const data = await this.request('/resource/validate', props)
    const { report } = data as { report: IReport }
    return { report }
  }

  async resourceTransform(props: { session?: ISession; resource: IResource }) {
    const data = await this.request('/resource/transform', props)
    const { resource, table } = data as { resource: IResource; table: ITable }
    return { resource, table }
  }
}

// TODO: don't have it as a singletone?
export const client = new Client()
