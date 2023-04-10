import * as React from 'react'
import * as zustand from 'zustand'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IFile } from '../../../interfaces'
import { IResource, IDialect, ISchema } from '../../../interfaces'
import { MetadataProps } from './Metadata'
import * as helpers from '../../../helpers'

export interface State {
  file: IFile
  client: Client
  panel?: 'metadata' | 'report' | 'source'
  dialog?: 'saveAs'
  original?: IResource | IDialect | ISchema
  modified?: IResource | IDialect | ISchema
  revision: number
  updateState: (patch: Partial<State>) => void
  load: () => Promise<void>
  clear: () => void
  revert: () => void
  save: (path?: string) => Promise<void>
}

export function makeStore(props: MetadataProps) {
  return createStore<State>((set, get) => ({
    ...props,
    revision: 0,
    updateState: (patch) => {
      const { revision } = get()
      if ('modified' in patch) patch.revision = revision + 1
      if ('resource' in patch) patch.revision = revision + 1
      set(patch)
    },
    load: async () => {
      const { client, file } = get()
      const { data } = await client.jsonRead({ path: file.path })
      set({ modified: cloneDeep(data), original: data })
    },
    clear: () => {
      const { file, updateState } = get()
      const descriptor = helpers.getInitialDescriptor(file.type)
      if (!descriptor) return
      updateState({ modified: cloneDeep(descriptor) })
    },
    revert: () => {
      const { original } = get()
      set({ modified: cloneDeep(original), revision: 0 })
    },
    save: async (path) => {
      const { file, client, modified } = get()
      if (!modified) return
      await client.metadataWrite({ path: path || file.path, data: modified })
      set({ modified: cloneDeep(modified), original: modified, revision: 0 })
    },
  }))
}

export const select = createSelector
export const selectors = {
  isUpdated: (state: State) => {
    return state.revision > 0
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
