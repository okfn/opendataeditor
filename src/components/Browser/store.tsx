import create from 'zustand'
import { client } from '../../client'
import createContext from 'zustand/context'
import { BrowserProps } from './Browser'
import { ISession, IResource, IReport, ITable } from '../../interfaces'

interface BrowserState {
  // Data
  session?: ISession
  path?: string
  resource?: IResource
  table?: ITable
  report?: IReport

  // Logic
  loadEverything: () => Promise<void>
}

export function makeStore(props: BrowserProps) {
  return create<BrowserState>((set, get) => ({
    // Data
    session: props.session,
    path: props.path,

    // Logic
    loadEverything: async () => {
      const { session, path } = get()
      if (!path) return
      const { resource } = await client.resourceDescribe({ session, path })
      const { table } = await client.resourceExtract({ session, resource })
      const { report } = await client.resourceValidate({ session, resource })
      set({ resource, table, report })
    },
  }))
}

export const { Provider, useStore } = createContext<BrowserState>()
