import cloneDeep from 'lodash/cloneDeep'
import { IPipeline } from './interfaces/pipeline'
import { IResource } from './interfaces/resource'
import { IDetector } from './interfaces/detector'
import { IQuery } from './interfaces/query'
import { IInquiry } from './interfaces/inquiry'
import { IReport } from './interfaces/report'
import { IStatus } from './interfaces/status'
import { IRow } from './interfaces/row'

export class Client {
  // Actions

  async describe(file: File, detector: IDetector) {
    const body = new FormData()
    const buffer = await file.arrayBuffer()
    body.append('file', new Blob([buffer]), file.name)
    body.append('detector', JSON.stringify(detector))
    const payload = { method: 'POST', body: body }
    const response = await fetch('/api/describe', payload)
    return response.json() as Promise<{ resource: IResource }>
  }

  async extract(file: File, resource: IResource, query: IQuery) {
    const body = new FormData()
    const buffer = await file.arrayBuffer()
    const resourceV4 = cloneDeep(resource) as any
    resourceV4.layout = query
    body.append('file', new Blob([buffer]), file.name)
    body.append('resource', JSON.stringify(resourceV4))
    const payload = { method: 'POST', body: body }
    const response = await fetch('/api/extract', payload)
    const content = await response.json()
    return content as { rows: IRow[] }
  }

  async validate(file: File, resource: IResource, inquiry: IInquiry) {
    const body = new FormData()
    const buffer = await file.arrayBuffer()
    const inquiryV4 = { tasks: [{ ...inquiry, source: resource }] }
    body.append('file', new Blob([buffer]), file.name)
    body.append('inquiry', JSON.stringify(inquiryV4))
    const payload = { method: 'POST', body: body }
    const response = await fetch('/api/validate', payload)
    const content = await response.json()
    return content as { report: IReport }
  }

  async transform(file: File, resource: IResource, pipeline: IPipeline) {
    const body = new FormData()
    const buffer = await file.arrayBuffer()
    const pipelineV4 = { tasks: [{ ...pipeline, source: resource, type: 'resource' }] }
    body.append('file', new Blob([buffer]), file.name)
    body.append('pipeline', JSON.stringify(pipelineV4))
    const payload = { method: 'POST', body: body }
    const response = await fetch('/api/transform', payload)
    const contentV4 = await response.json()
    const content = { ...contentV4, status: contentV4.status.tasks[0] }
    return content as { status: IStatus; targetRows: IRow[] }
  }
}

export const client = new Client()
