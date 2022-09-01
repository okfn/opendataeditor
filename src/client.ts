import omit from 'lodash/omit'
import { IResource } from './interfaces/resource'
import { IDetector } from './interfaces/detector'
import { IReport } from './interfaces/report'
import { ITable } from './interfaces/table'
import { IToken } from './interfaces/session'

export class Client {
  basepath: string = '/api'

  async request(path: string, props: { [key: string]: any; file?: File } = {}) {
    if (this.basepath) path = this.basepath + path
    const method = 'POST'
    let headers
    let body
    if (props.file) {
      body = new FormData()
      body.append('file', new Blob([await props.file.arrayBuffer()]), props.file.name)
      body.append('detector', JSON.stringify(omit(props, 'file')))
    } else {
      headers = { 'Content-Type': 'application/json;charset=utf-8' }
      body = JSON.stringify(props)
    }
    const response = await fetch(path, { method, headers, body })
    return response.json()
  }

  // Resource

  async resourceDescribe(props: { token?: IToken; path: string; detector?: IDetector }) {
    const response = await this.request('/resource/describe', props)
    const { resource } = response as { resource: IResource }
    return { resource }
  }

  async resourceExtract(props: { token?: IToken; resource: IResource }) {
    const data = await this.request('/resource/extract', props)
    const { table } = data as { table: ITable }
    return { table }
  }

  async resourceValidate(props: { token?: IToken; resource: IResource }) {
    const data = await this.request('/resource/validate', props)
    const { report } = data as { report: IReport }
    return { report }
  }

  async resourceTransform(props: { token?: IToken; resource: IResource }) {
    const data = await this.request('/resource/transform', props)
    const { resource, table } = data as { resource: IResource; table: ITable }
    return { resource, table }
  }

  // Session

  async sessionCreate() {
    const data = await this.request('/session/create')
    const { token } = data as { token: string }
    return { token }
  }

  async sessionCreateFile(props: { token?: IToken; file: File }) {
    const data = await this.request('/session/createFile', props)
    const { path } = data as { path: string }
    return { path }
  }

  async sessionDeleteFile(props: { token?: IToken; path: string }) {
    const data = await this.request('/session/deleteFile', props)
    const { path } = data as { path: string }
    return { path }
  }

  async sessionListFiles(props: { token?: IToken }) {
    const data = await this.request('/session/listFiles', props)
    const { paths } = data as { paths: string[] }
    return { paths }
  }
}

export const client = new Client()
