import cloneDeep from 'lodash/cloneDeep'
import { IPipeline } from './interfaces/pipeline'
import { IResource } from './interfaces/resource'
import { IDetector } from './interfaces/detector'
import { IQuery } from './interfaces/query'
import { IInquiry } from './interfaces/inquiry'
import { IReport } from './interfaces/report'
import { IStatus } from './interfaces/status'
import { IFile } from './interfaces/file'
import { IRow } from './interfaces/table'

export class Client {
  // Actions

  async describe(file: IFile, detector: IDetector) {
    const body = new FormData()
    body.append('file', new Blob([file.bytes]), file.name)
    body.append('detector', JSON.stringify(detector))
    const payload = { method: 'POST', body: body }
    const response = await fetch('/api/describe', payload)
    const { resource } = (await response.json()) as { resource: IResource }
    return { resource }
  }

  async extract(file: IFile, resource: IResource, query: IQuery) {
    const body = new FormData()
    const resourceV4 = cloneDeep(resource) as any
    resourceV4.layout = query
    body.append('file', new Blob([file.bytes]), file.name)
    body.append('resource', JSON.stringify(resourceV4))
    const payload = { method: 'POST', body: body }
    const response = await fetch('/api/extract', payload)
    const { rows } = (await response.json()) as { rows: IRow[] }
    const table = { schema: resource.schema, rows }
    return { table }
  }

  async validate(file: IFile, resource: IResource, inquiry: IInquiry) {
    const body = new FormData()
    const inquiryV4 = { tasks: [{ ...inquiry, source: resource }] }
    body.append('file', new Blob([file.bytes]), file.name)
    body.append('inquiry', JSON.stringify(inquiryV4))
    const payload = { method: 'POST', body: body }
    const response = await fetch('/api/validate', payload)
    const { report } = (await response.json()) as { report: IReport }
    return { report }
  }

  async transform(file: IFile, resource: IResource, pipeline: IPipeline) {
    const body = new FormData()
    const pipelineV4 = { tasks: [{ ...pipeline, source: resource, type: 'resource' }] }
    body.append('file', new Blob([file.bytes]), file.name)
    body.append('pipeline', JSON.stringify(pipelineV4))
    const payload = { method: 'POST', body: body }
    const response = await fetch('/api/transform', payload)
    const contentV4 = await response.json()
    const content = { ...contentV4, status: contentV4.status.tasks[0] }
    const { status, rows } = content as { status: IStatus; rows: IRow[] }
    const table = { schema: status.target.schema, rows }
    return { status, table }
  }
}

export const client = new Client()
