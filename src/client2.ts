import { IResource } from './interfaces/resource'
import { IDetector } from './interfaces/detector'
import { IReport } from './interfaces/report'
import { IRow } from './interfaces/table'
import * as helpers from './helpers'

export class Client {
  // Resource

  async resourceDescribe(props: { detector?: IDetector }) {
    const response = await helpers.request('/api/describe', props)
    const { resource } = (await response.json()) as { resource: IResource }
    return { resource }
  }

  async resourceExtract(props: { resource: IResource }) {
    const response = await helpers.request('/api/extract', props)
    const { rows } = (await response.json()) as { rows: IRow[] }
    return { rows }
  }

  async resourceValidate(props: { resource: IResource }) {
    const response = await helpers.request('/api/validate', props)
    const { report } = (await response.json()) as { report: IReport }
    return { report }
  }

  async resourceTransform(props: { resource: IResource }) {
    const response = await helpers.request('/api/transform', props)
    const { resource, rows } = (await response.json()) as {
      resource: IResource
      rows: IRow[]
    }
    return { resource, rows }
  }
}

export const client = new Client()
