import create from 'zustand'
import { client } from './client'
import { IInquiry } from './interfaces/inquiry'
import { IResource } from './interfaces/resource'
import { IPipeline } from './interfaces/pipeline'

export interface IState {
  page: string
  file?: File
  resource?: IResource
  inquiry?: IResource
  pipeline?: IPipeline
}

export interface ILogic {
  setPage: (page: string) => void
  uploadFile: (file: File) => void
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
    const { file, resource, pipeline } = get()
    if (!file || !resource || !pipeline) return
    if (page === 'extract') {
      patch = await client.extract(file, resource)
    } else if (page === 'validate') {
      patch = await client.validate(file, resource)
    } else if (page === 'transform') {
      patch = await client.transform(file, resource, pipeline)
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
    const patch = await client.describe(file)
    set({ page: 'describe', ...patch })
  },

  // Metadata

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
