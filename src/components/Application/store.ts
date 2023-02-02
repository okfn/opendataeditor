import * as React from 'react'
import * as zustand from 'zustand'
import create from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import { Client } from '../../client'
import { IResourceItem, IFileItem } from '../../interfaces'
import { ApplicationProps } from './Application'

export interface State {
  client: Client
  isWelcome?: boolean
  resourceItem?: IResourceItem

  // General

  setResourceItem: (fileItem?: IFileItem) => void
  setIsWelcome: (value: boolean) => void
}

export function createStore(props: ApplicationProps) {
  return create<State>((set, get) => ({
    ...props,

    // General

    setIsWelcome: async (isWelcome) => set({ isWelcome }),
    setResourceItem: async (fileItem) => {
      if (!fileItem || fileItem.type === 'folder') return
      const { client } = get()
      const { item } = await client.resourceRead({ path: fileItem.path, create: true })
      set({ resourceItem: item })
    },
  }))
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
