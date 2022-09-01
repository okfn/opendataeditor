import omit from 'lodash/omit'
import { IResource } from './interfaces/resource'
import { IDetector } from './interfaces/detector'
import { IReport } from './interfaces/report'
import { IToken } from './interfaces/session'
import { IFile } from './interfaces/file'
import { IRow } from './interfaces/table'

export class Client {
  basepath: string = '/api'

  async request(path: string, props: { [key: string]: any; file?: IFile } = {}) {
    if (this.basepath) path = this.basepath + path
    const method = 'POST'
    let headers
    let body
    if (props.file) {
      body = new FormData()
      body.append('file', new Blob([props.file.bytes]), props.file.name)
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
    const { rows } = data as { rows: IRow[] }
    return { rows }
  }

  async resourceValidate(props: { token?: IToken; resource: IResource }) {
    const data = await this.request('/resource/validate', props)
    const { report } = data as { report: IReport }
    return { report }
  }

  async resourceTransform(props: { token?: IToken; resource: IResource }) {
    const data = await this.request('/resource/transform', props)
    const { resource, rows } = data as { resource: IResource; rows: IRow[] }
    return { resource, rows }
  }

  // Session

  async sessionCreate() {
    const data = await this.request('/session/create')
    const { token } = data as { token: string }
    return { token }
  }

  async sessionCreateFile(props: { token?: IToken; file: IFile }) {
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
