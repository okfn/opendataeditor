import * as React from 'react'
import * as zustand from 'zustand'
import noop from 'lodash/noop'
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
  path: string
  client: Client
  onSave: () => void
  onSaveAs: (path: string) => void
  panel?: 'report' | 'source'
  dialog?: 'saveAs'
  file?: IFile
  original?: IResource | IDialect | ISchema
  modified?: IResource | IDialect | ISchema
  revision: number
  updateState: (patch: Partial<State>) => void
  load: () => Promise<void>
  clear: () => void
  revert: () => void
  save: () => Promise<void>
  saveAs: (path: string) => Promise<void>
}

export function makeStore(props: MetadataProps) {
  return createStore<State>((set, get) => ({
    ...props,
    onSave: props.onSave || noop,
    onSaveAs: props.onSaveAs || noop,
    revision: 0,
    updateState: (patch) => {
      const { revision } = get()
      if ('modified' in patch) patch.revision = revision + 1
      if ('resource' in patch) patch.revision = revision + 1
      set(patch)
    },
    load: async () => {
      const { path, client } = get()
      const { file } = await client.fileIndex({ path })
      if (!file) return
      set({ file })
      const { data } = await client.jsonRead({ path: file.path })
      set({ modified: cloneDeep(data), original: data })
    },
    clear: () => {
      const { file, updateState } = get()
      if (!file) return
      const descriptor = helpers.getInitialDescriptor(file.type)
      if (!descriptor) return
      updateState({ modified: cloneDeep(descriptor) })
    },
    revert: () => {
      const { original } = get()
      set({ modified: cloneDeep(original), revision: 0 })
    },
    save: async () => {
      const { file, client, modified, onSave, load } = get()
      if (!file || !modified) return
      await client.metadataWrite({ path: file.path, data: modified })
      set({ modified: cloneDeep(modified), original: modified, revision: 0 })
      onSave()
      load()
    },
    saveAs: async (path) => {
      const { client, modified, onSaveAs } = get()
      if (!modified) return
      // TODO: write resource as well?
      await client.metadataWrite({ path, data: modified })
      onSaveAs(path)
    },
  }))
}

export const select = createSelector
export const selectors = {
  // TODO: consider using https://github.com/epoberezkin/fast-deep-equal (200 000 op/sec)
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
