import * as React from 'react'
import * as zustand from 'zustand'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IFile, IResource } from '../../../interfaces'
import { FileProps } from './File'

export interface State {
  file: IFile
  client: Client
  panel?: 'metadata'
  dialog?: 'saveAs'
  revision: number
  content?: ArrayBuffer
  resource: IResource
  updateState: (patch: Partial<State>) => void
  loadContent: () => Promise<void>
  saveAs: (newPath: string) => Promise<void>
  revert: () => void
  save: () => void
}

export function makeStore(props: FileProps) {
  return createStore<State>((set, get) => ({
    ...props,
    revision: 0,
    // TODO: review case of missing record (not indexed)
    resource: cloneDeep(props.file.record!.resource),
    updateState: (patch) => {
      const { revision } = get()
      if ('resource' in patch) patch.revision = revision + 1
      set(patch)
    },
    loadContent: async () => {
      const { client, file } = get()
      if (!['jpg', 'png'].includes(file.record?.resource.format || '')) return
      const { bytes } = await client.fileRead({ path: file.path })
      set({ content: bytes })
    },
    saveAs: async (path) => {
      const { client, content } = get()
      await client.fileWrite({ path, file: new File([content!], 'name') })
    },
    revert: () => {
      const { file } = get()
      // TODO: review case of missing record (not indexed)
      set({ resource: cloneDeep(file.record!.resource), revision: 0 })
    },
    save: async () => {
      const { file, client, resource } = get()
      await client.fileUpdate({ path: file.path, resource })
      set({ revision: 0 })
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
