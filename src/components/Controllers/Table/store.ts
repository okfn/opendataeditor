import * as React from 'react'
import * as zustand from 'zustand'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IFile, ITable, ITablePatch, IResource } from '../../../interfaces'
import { TableProps } from './Table'

export interface State {
  client: Client
  file: IFile
  tablePatch: ITablePatch
  table?: ITable
  source?: string
  selectedColumn?: number
  loadTable: () => Promise<void>
  loadSource: () => Promise<void>
  updatePatch: (rowNumber: number, fieldName: string, value: any) => void
  exportTable: (name: string, format: string) => Promise<string>
  updateColumn: (selectedColumn: number) => void
  downloadTable: (
    name: string,
    format: string
  ) => Promise<{ bytes: ArrayBuffer; path: string }>
  onExport: (path: string) => void

  // Version 2
  panel?: 'metadata' | 'report' | 'changes' | 'source'
  dialog?: 'saveAs'
  resource: IResource
  revision: number
  updateState: (patch: Partial<State>) => void
  updateResource: (resource: IResource) => Promise<void>
  revert: () => void
  save: () => Promise<void>
}

export function makeStore(props: TableProps) {
  return createStore<State>((set, get) => ({
    ...props,
    tablePatch: {},

    // General

    loadTable: async () => {
      const { client, file } = get()
      const { table } = await client.tableRead({ path: file.path })
      set({ table })
    },
    loadSource: async () => {
      const { client, file } = get()
      const { text } = await client.textRead({ path: file.path })
      set({ source: text })
    },
    updatePatch: (rowNumber, fieldName, value) => {
      const { tablePatch } = get()
      tablePatch[rowNumber] = { ...tablePatch[rowNumber], [fieldName]: value }
      set({ tablePatch: { ...tablePatch } })
    },
    // TODO: implement
    exportTable: async (name, format) => {
      const { client, file } = get()
      const result = await client.tableExport({
        source: file.path,
        target: `${name}.${format}`,
      })
      return result.path
    },
    // TODO: temporary solution
    downloadTable: async (name, format) => {
      const { client, file } = get()
      const { path } = await client.tableExport({
        source: file.path,
        target: `${name}.${format}`,
      })
      const { bytes } = await client.fileRead({ path })
      await client.fileDelete({ path })
      return { bytes: bytes, path: path }
    },
    updateResource: async (resource) => {
      const { file, client } = get()
      await client.jsonWrite({ path: file.path, data: resource })
    },
    updateColumn: (selectedColumn) => {
      set({ selectedColumn })
    },

    // Version 2
    revision: 0,
    // TODO: review case of missing record (not indexed)
    resource: cloneDeep(props.file.record!.resource),
    updateState: (patch) => {
      const { revision } = get()
      if ('resource' in patch) patch.revision = revision + 1
      set(patch)
    },
    revert: () => {
      const { file } = get()
      // TODO: review case of missing record (not indexed)
      set({ resource: cloneDeep(file.record!.resource), revision: 0 })
    },
    // TODO: needs to udpate file object as well
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
