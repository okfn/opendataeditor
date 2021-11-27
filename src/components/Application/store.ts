import create from 'zustand'
import { client } from '../../client'
import { IReport, IStatus, IRow } from '../../interfaces'
import { IInquiry, IDetector, IResource, IPipeline } from '../../interfaces'

export interface IState {
  contentType: string
  file?: File
  detector: IDetector
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
  setContentType: (contentType: string) => void
  uploadFile: (file: File) => void
  updateDetector: (patch: Partial<IDetector>) => void
  updateResource: (patch: Partial<IResource>) => void
  updateInquiry: (patch: Partial<IInquiry>) => void
  updatePipeline: (patch: Partial<IPipeline>) => void
}

export const initialState = {
  contentType: 'home',
  // TODO: move to settings or server-side
  detector: { bufferSize: 10000, sampleSize: 100 },
}

export const useStore = create<IState & ILogic>((set, get) => ({
  ...initialState,

  // Page

  // TODO: rewrite
  setContentType: async (contentType) => {
    let patch = {}
    const { file, resource, inquiry, pipeline } = get()
    if (!file || !resource || !inquiry || !pipeline) {
      set({ contentType })
      return
    }
    if (contentType === 'extract') {
      patch = await client.extract(file, resource)
    } else if (contentType === 'validate') {
      patch = await client.validate(file, inquiry)
    } else if (contentType === 'transform') {
      patch = await client.transform(file, pipeline)
    }
    set({ contentType, ...patch })
  },

  // File

  uploadFile: async (file) => {
    // TODO: implement properly
    if (file.type !== 'text/csv' || file.size > 10000000) {
      // TODO: clean file input
      alert('Currently only CSV files under 10Mb are supported')
      return
    }
    const { detector } = get()
    const { resource } = await client.describe(file, detector)
    const inquiry = { source: resource, checks: [] }
    const pipeline = { source: resource, type: 'resource', steps: [] }
    // TODO: find a proper place for it
    const text = await file.text()
    set({ contentType: 'describe', file, resource, inquiry, pipeline, text })
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
