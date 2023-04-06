import noop from 'lodash/noop'
import * as React from 'react'
import * as zustand from 'zustand'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IFile, ITable, ITablePatch, IResource } from '../../../interfaces'
import { TableProps } from './Table'

type IPanel = 'metadata' | 'report' | 'changes' | 'source'
type IDialog = 'export/table'

export interface State {
  client: Client
  file: IFile
  tablePatch: ITablePatch
  table?: ITable
  source?: string
  selectedColumn?: number
  panel?: IPanel
  dialog?: IDialog
  resource: IResource
  revision: number
  setPanel: (panel?: IPanel) => void
  loadTable: () => Promise<void>
  loadSource: () => Promise<void>
  updatePatch: (rowNumber: number, fieldName: string, value: any) => void
  commitPatch: () => void
  revertPatch: () => void
  exportTable: (name: string, format: string) => Promise<string>
  importTable?: () => void
  updateResource: (resource: IResource) => Promise<void>
  updateColumn: (selectedColumn: number) => void
  setDialog: (dialog?: IDialog) => void
  downloadTable: (
    name: string,
    format: string
  ) => Promise<{ bytes: ArrayBuffer; path: string }>
  onExport: (path: string) => void

  // Version 2
  updateState: (patch: Partial<State>) => void
  revert: () => void
  save: () => Promise<void>
}

export function makeStore(props: TableProps) {
  return createStore<State>((set, get) => ({
    ...props,
    revision: 0,
    // TODO: review case of missing record (not indexed)
    resource: cloneDeep(props.file.record!.resource),
    tablePatch: {},

    // General

    setPanel: (panel) => set({ panel }),
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
    commitPatch: async () => {
      const { client, file, tablePatch } = get()
      const { path } = await client.tableWrite({ path: file.path, tablePatch })
      console.log(path)
      set({ tablePatch: {} })
    },
    revertPatch: () => set({ tablePatch: {} }),
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
    importTable: noop,
    updateResource: async (resource) => {
      const { file, client } = get()
      await client.jsonWrite({ path: file.path, data: resource })
    },
    updateColumn: (selectedColumn) => {
      set({ selectedColumn })
    },
    setDialog: (dialog) => set({ dialog }),

    // Version 2
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
