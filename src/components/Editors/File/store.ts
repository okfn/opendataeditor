import noop from 'lodash/noop'
import * as React from 'react'
import * as zustand from 'zustand'
import create from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IRecord } from '../../../interfaces'
import { FileProps } from './File'

export interface State {
  // Data

  client: Client
  record: IRecord
  isMetadata?: boolean
  bytes?: string
  text?: string

  // Logic

  loadBytes: () => Promise<void>
  loadText: () => Promise<void>
  exportFile?: (format: string) => void
  importFile?: () => void
  updateResource?: () => void
}

export function createStore(props: FileProps) {
  return create<State>((set, get) => ({
    // Data

    ...props,
    tablePatch: {},

    // Logic

    loadBytes: async () => {
      const { client, record } = get()
      const { bytes } = await client.resourceReadBytes({ resource: record.resource })
      set({ bytes })
    },
    loadText: async () => {
      const { client, record } = get()
      const { text } = await client.resourceReadText({ resource: record.resource })
      set({ text })
    },
    // TODO: implement
    exportFile: noop,
    importFile: noop,
    updateResource: noop,
  }))
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
