import * as React from 'react'
import * as zustand from 'zustand'
import create from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IRecord } from '../../../interfaces'
import { MetadataProps } from './Metadata'
import { IPublish } from '../../../interfaces/publish'

export interface State {
  // Data

  client: Client
  record: IRecord
  type: 'package' | 'resource' | 'dialect' | 'schema' | 'checklist' | 'pipeline'
  onPathChange?: (path?: string) => void
  descriptor?: object
  isPublish?: boolean
  publishedPath?: string

  // Logic
  loadDescriptor: () => Promise<void>
  togglePublish: () => void
  publishPackage: (params: IPublish) => Promise<any>
}

export function createStore(props: MetadataProps) {
  return create<State>((set, get) => ({
    // Data

    ...props,

    // Logic

    loadDescriptor: async () => {
      const { client, record } = get()
      const { bytes } = await client.fileRead({ path: record.resource.path })
      // TODO: fix
      // const decoder = new TextDecoder(record.resource.encoding)
      // const text = decoder.decode(bytes)
      // @ts-ignore
      const data = JSON.parse(bytes)
      set({ descriptor: data })
    },
    togglePublish: () => {
      set({ isPublish: !get().isPublish })
    },
    publishPackage: async (params: IPublish) => {
      const { client } = get()
      const { content } = await client.projectPublish({ params })
      return content
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
