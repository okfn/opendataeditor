import create from 'zustand'
import { client } from '../../client'
import { IReport, IStatus, IRow } from '../../interfaces'
import { IInquiry, IStrategy, IResource, IPipeline } from '../../interfaces'

export interface IState {
  page: string
  file?: File
  strategy?: IStrategy
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
  updateStrategy: (patch: Partial<IStrategy>) => void
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
    const strategy = { bufferSize: 10000, sampleSize: 100 }
    const { resource } = await client.describe(file, strategy)
    const inquiry = { source: resource, checks: [] }
    const pipeline = { source: resource, type: 'resource', steps: [] }
    // TODO: find a proper place for it
    const text = await file.text()
    set({ page: 'describe', file, strategy, resource, inquiry, pipeline, text })
  },

  // Metadata

  updateStrategy: (patch) => {
    const { strategy } = get()
    if (strategy) set({ strategy: { ...strategy, ...patch } })
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
