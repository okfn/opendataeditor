import create from 'zustand'
import createContext from 'zustand/context'
import { Client } from '../../client'
import { ApplicationProps } from './Application'

export interface ApplicationState {
  client?: Client
  path?: string
  ensureClient: () => Promise<void>
  selectPath: (path?: string) => void
}

export function makeStore(props: ApplicationProps) {
  return create<ApplicationState>((set, get) => ({
    // Data
    ...props,

    // Logic
    ensureClient: async () => {
      if (get().client) return
      const client = await Client.connect()
      set({ client })
    },
    selectPath: (path) => {
      set({ path })
    },
  }))
}

export const { Provider, useStore } = createContext<ApplicationState>()
