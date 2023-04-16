import * as React from 'react'
import * as zustand from 'zustand'
import noop from 'lodash/noop'
import isEqual from 'fast-deep-equal'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { IFile } from '../../../interfaces'
import { Client } from '../../../client'
import { IResource, IView, ITable, IFieldItem } from '../../../interfaces'
import { SqlProps } from './View'
import * as settings from '../../../settings'

export interface State {
  path: string
  client: Client
  isDraft?: boolean
  onSave: () => void
  onSaveAs: (path: string) => void
  onRevert?: () => void
  dialog?: 'saveAs'
  panel?: 'metadata' | 'report' | 'source' | 'editor'
  fields?: IFieldItem[]
  file?: IFile
  resource?: IResource
  original?: IView
  modified?: IView
  table?: ITable
  error?: string
  updateState: (patch: Partial<State>) => void
  load: () => Promise<void>
  clear: () => void
  revert: () => void
  save: () => Promise<void>
  saveAs: (path: string) => Promise<void>
}

export interface ExceptionError {
  message: string
}

export function makeStore(props: SqlProps) {
  return createStore<State>((set, get) => ({
    ...props,
    onSaveAs: props.onSaveAs || noop,
    onSave: props.onSave || noop,
    panel: props.isDraft ? 'editor' : undefined,
    updateState: (patch) => {
      set(patch)
    },
    load: async () => {
      const { path, client } = get()
      const { file } = await client.fileIndex({ path })
      if (!file) return
      const resource = cloneDeep(file.record!.resource)
      set({ file, resource })
      const { items } = await client.fieldList()
      const { data } = await client.jsonRead({ path: file.path })
      set({ modified: cloneDeep(data), original: data, fields: items })
      // TODO: move to autoupdating on change (throttle)
      if (file.record?.tableName) {
        const query = `select * from "${file.record?.tableName}"`
        const { table } = await client.tableQuery({ query })
        set({ table })
      }
    },
    clear: () => {
      const { updateState } = get()
      updateState({ modified: cloneDeep(settings.INITIAL_VIEW) })
    },
    revert: () => {
      const { file, original, onRevert } = get()
      if (!file) return
      set({
        resource: cloneDeep(file.record!.resource),
        modified: cloneDeep(original),
      })
      onRevert && onRevert()
    },
    save: async () => {
      const { file, client, resource, modified, onSave, load } = get()
      if (!file || !resource || !modified) return
      await client.fileUpdate({ path: file.path, resource })
      await client.viewWrite({ path: file.path, view: modified })
      set({ modified: cloneDeep(modified), original: modified })
      onSave()
      load()
    },
    saveAs: async (path) => {
      const { client, modified, onSaveAs } = get()
      if (!modified) return
      // TODO: write resource as well?
      await client.viewWrite({ path, view: modified })
      onSaveAs(path)
    },
  }))
}

export const select = createSelector
export const selectors = {
  isUpdated: (state: State) => {
    return (
      state.isDraft ||
      !isEqual(state.original, state.modified) ||
      !isEqual(state.resource, state.file?.record!.resource)
    )
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
