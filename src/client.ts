import React from 'react'
import ReactDOM from 'react-dom'
// TODO: remove components dependency
import Application from './components/Application'
import { IPipeline } from './interfaces/pipeline'
import { IResource } from './interfaces/resource'
import { IDetector } from './interfaces/detector'
import { IInquiry } from './interfaces/inquiry'
import { IReport } from './interfaces/report'
import { IStatus } from './interfaces/status'
import { IRow } from './interfaces/row'

export class Client {
  start(element: any) {
    ReactDOM.render(React.createElement(Application, {}, null), element)
    return { dispose: () => ReactDOM.unmountComponentAtNode(element) }
  }

  // Actions

  async describe(file: File, detector: IDetector) {
    const body = new FormData()
    const buffer = await file.arrayBuffer()
    body.append('file', new Blob([buffer]), file.name)
    body.append('detector', JSON.stringify(detector))
    const payload = { method: 'POST', body: body }
    const response = await fetch('http://localhost:7070/api/describe', payload)
    return response.json() as Promise<{ resource: IResource }>
  }

  async extract(file: File, resource: IResource) {
    const body = new FormData()
    const buffer = await file.arrayBuffer()
    body.append('file', new Blob([buffer]), file.name)
    body.append('resource', JSON.stringify(resource))
    const payload = { method: 'POST', body: body }
    const response = await fetch('http://localhost:7070/api/extract', payload)
    const content = await response.json()
    return content as { report: IRow[] }
  }

  async validate(file: File, inquiry: IInquiry) {
    const body = new FormData()
    const buffer = await file.arrayBuffer()
    const inquiryV4 = { tasks: [inquiry] }
    body.append('file', new Blob([buffer]), file.name)
    body.append('inquiry', JSON.stringify(inquiryV4))
    const payload = { method: 'POST', body: body }
    const response = await fetch('http://localhost:7070/api/validate', payload)
    const content = await response.json()
    return content as { report: IReport }
  }

  async transform(file: File, pipeline: IPipeline) {
    const body = new FormData()
    const buffer = await file.arrayBuffer()
    const pipelineV4 = { tasks: [pipeline] }
    body.append('file', new Blob([buffer]), file.name)
    body.append('pipeline', JSON.stringify(pipelineV4))
    const payload = { method: 'POST', body: body }
    const response = await fetch('http://localhost:7070/api/transform', payload)
    const contentV4 = await response.json()
    const content = { ...contentV4, status: contentV4.status.tasks[0] }
    return content as { status: IStatus; targetRows: IRow[] }
  }
}

export const client = new Client()
