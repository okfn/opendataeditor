import * as React from 'react'
import * as zustand from 'zustand'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IFile, IResource } from '../../../interfaces'
import { JsonProps } from './Json'

export interface State {
  file: IFile
  client: Client
  panel?: 'metadata'
  dialog?: 'saveAs'
  revision: number
  content?: string
  resource: IResource
  prevContent?: string
  updateState: (patch: Partial<State>) => void
  loadContent: () => Promise<void>
  saveAs: (path: string) => Promise<void>
  revert: () => void
  save: () => Promise<void>
}

export function makeStore(props: JsonProps) {
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
      const { text } = await client.textRead({ path: file.path })
      set({ content: text, prevContent: text })
    },
    saveAs: async (path) => {
      const { client, content } = get()
      await client.textWrite({ path, text: content! })
    },
    revert: () => {
      const { file, prevContent } = get()
      // TODO: review case of missing record (not indexed)
      set({
        resource: cloneDeep(file.record!.resource),
        content: prevContent,
        revision: 0,
      })
    },
    save: async () => {
      const { file, client, content, resource } = get()
      await client.fileUpdate({ path: file.path, resource })
      await client.textWrite({ path: file.path, text: content! })
      // TODO: needs to udpate file object
      set({ prevContent: content, revision: 0 })
    },
  }))
}

export const select = createSelector
export const selectors = {
  isUpdated: (state: State) => {
    return state.revision > 0 || state.content !== state.prevContent
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
