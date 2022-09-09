import noop from 'lodash/noop'
import create from 'zustand'
import createContext from 'zustand/context'
import { Client } from '../../client'
import { IResource, IReport } from '../../interfaces'
import { FileProps } from './File'

export interface FileState {
  // Data

  client: Client
  path: string
  resource?: IResource
  report?: IReport
  source?: string

  // Logic

  loadEverything: () => Promise<void>
  loadSource: () => Promise<void>
  exportFile: () => void
  importFile: () => void
  updateResource: () => void
}

export function makeStore(props: FileProps) {
  return create<FileState>((set, get) => ({
    // Data

    ...props,
    tablePatch: {},

    // Logic

    loadEverything: async () => {
      const { client, path } = get()
      if (!path) return
      const { resource } = await client.resourceDescribe({ path })
      const { report } = await client.resourceValidate({ resource })
      set({ resource, report })
    },
    loadSource: async () => {
      const { client, path } = get()
      const { text } = await client.projectReadFile({ path })
      set({ source: text })
    },
    exportFile: noop,
    importFile: noop,
    updateResource: noop,
  }))
}

export const { Provider, useStore } = createContext<FileState>()
