import create from 'zustand'
import { client } from './client'
import { IInquiry } from './interfaces/inquiry'
import { IDetector } from './interfaces/detector'
import { IResource } from './interfaces/resource'
import { IPipeline } from './interfaces/pipeline'
import { IReport } from './interfaces/report'
import { IStatus } from './interfaces/status'
import { IRow } from './interfaces/row'

export interface IState {
  page: string
  file?: File
  detector?: IDetector
  resource?: IResource
  inquiry?: IInquiry
  report?: IReport
  pipeline?: IPipeline
  status?: IStatus
  text?: string
  rows?: IRow[]
  targetRows?: IRow[]
}

export interface ILogic {
  setPage: (page: string) => void
  uploadFile: (file: File) => void
  updateDetector: (patch: Partial<IDetector>) => void
  updateResource: (patch: Partial<IResource>) => void
  updateInquiry: (patch: Partial<IInquiry>) => void
  updatePipeline: (patch: Partial<IPipeline>) => void
}

export const initialState = {
  page: 'home',
}

export const useStore = create<IState & ILogic>((set, get) => ({
  ...initialState,

  // Page

  setPage: async (page) => {
    let patch = {}
    const { file, resource, inquiry, pipeline } = get()
    if (!file || !resource || !inquiry || !pipeline) return
    if (page === 'extract') {
      patch = await client.extract(file, resource)
    } else if (page === 'validate') {
      patch = await client.validate(file, inquiry)
    } else if (page === 'transform') {
      patch = await client.transform(file, pipeline)
    }
    set({ page, ...patch })
  },

  // File

  uploadFile: async (file) => {
    // TODO: implement properly
    if (file.type !== 'text/csv' || file.size > 10000000) {
      // TODO: clean file input
      alert('Currently only CSV files under 10Mb are supported')
      return
    }
    const detector = { bufferSize: 10000, sampleSize: 100 }
    const { resource } = await client.describe(file, detector)
    const inquiry = { source: resource, checks: [] }
    const pipeline = { source: resource, type: 'resource', steps: [] }
    // TODO: find a proper place for it
    const text = await file.text()
    set({ page: 'describe', file, detector, resource, inquiry, pipeline, text })
  },

  // Metadata

  updateDetector: (patch) => {
    const { detector } = get()
    if (detector) set({ detector: { ...detector, ...patch } })
  },
  updateResource: (patch) => {
    const { resource } = get()
    if (resource) set({ resource: { ...resource, ...patch } })
  },
  updateInquiry: (patch) => {
    const { inquiry } = get()
    if (inquiry) set({ inquiry: { ...inquiry, ...patch } })
  },
  updatePipeline: (patch) => {
    const { pipeline } = get()
    if (pipeline) set({ pipeline: { ...pipeline, ...patch } })
  },
}))
