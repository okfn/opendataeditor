import * as React from 'react'
import * as zustand from 'zustand'
import noop from 'lodash/noop'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IFile, ITable, ITablePatch, IResource } from '../../../interfaces'
import { TableProps } from './Table'

export interface State {
  path: string
  client: Client
  onSave: () => void
  onSaveAs: (path: string) => void
  panel?: 'metadata' | 'report' | 'changes' | 'source'
  dialog?: 'saveAs'
  file?: IFile
  resource?: IResource
  revision: number
  updateState: (patch: Partial<State>) => void
  updateResource: (resource: IResource) => Promise<void>
  load: () => Promise<void>
  revert: () => void
  save: () => Promise<void>
  saveAs: (path: string) => Promise<void>

  // Legacy

  tablePatch: ITablePatch
  table?: ITable
  source?: string
  selectedColumn?: number
  updatePatch: (rowNumber: number, fieldName: string, value: any) => void
  exportTable: (name: string, format: string) => Promise<void>
  updateColumn: (selectedColumn: number) => void
}

export function makeStore(props: TableProps) {
  return createStore<State>((set, get) => ({
    ...props,
    onSave: props.onSave || noop,
    onSaveAs: props.onSaveAs || noop,
    tablePatch: {},
    revision: 0,
    updateState: (patch) => {
      const { revision } = get()
      if ('resource' in patch) patch.revision = revision + 1
      set(patch)
    },
    load: async () => {
      const { path, client } = get()
      const { file } = await client.fileIndex({ path })
      if (!file) return
      const resource = cloneDeep(file.record!.resource)
      const { text } = await client.textRead({ path: file.path })
      const { table } = await client.tableRead({ path: file.path })
      set({ file, resource, source: text, table })
    },
    revert: () => {
      const { file } = get()
      if (!file) return
      set({ resource: cloneDeep(file.record!.resource), revision: 0 })
    },
    // TODO: implement
    save: async () => {
      const { file, client, resource, onSave, load } = get()
      if (!file || !resource) return
      await client.fileUpdate({ path: file.path, resource })
      set({ revision: 0 })
      onSave()
      load()
    },
    // TODO: implement
    saveAs: async (path) => {
      const { onSaveAs } = get()
      onSaveAs(path)
    },

    // Legacy

    updatePatch: (rowNumber, fieldName, value) => {
      const { tablePatch } = get()
      tablePatch[rowNumber] = { ...tablePatch[rowNumber], [fieldName]: value }
      set({ tablePatch: { ...tablePatch } })
    },
    exportTable: async (name, format) => {
      console.log(name, format)
    },
    updateResource: async (resource) => {
      console.log(resource)
    },
    updateColumn: (selectedColumn) => {
      set({ selectedColumn })
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
