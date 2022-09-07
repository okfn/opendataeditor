import create from 'zustand'
import { client } from '../../client'
import createContext from 'zustand/context'
import { ContentProps } from './Content'
import { ISession, IResource, IReport, ITable } from '../../interfaces'

interface ContentState {
  session?: ISession
  path: string
  resource?: IResource
  table?: ITable
  report?: IReport
  isMetadataOpen?: boolean
  toggleMetadataOpen: () => void
  loadEverything: () => Promise<void>
}

export function makeStore(props: ContentProps) {
  return create<ContentState>((set, get) => ({
    session: props.session,
    path: props.path,
    toggleMetadataOpen: () => {
      set({ isMetadataOpen: !get().isMetadataOpen })
    },
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

export const { Provider, useStore } = createContext<ContentState>()
