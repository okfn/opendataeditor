import * as React from 'react'
import * as zustand from 'zustand'
import delay from 'delay'
import { createStore } from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import { Client } from '../../client'
import { ApplicationProps } from './index'
import { IDialog } from './types'
import * as settings from '../../settings'
import * as helpers from '../../helpers'
import * as types from '../../types'

export interface State {
  path?: string
  client: Client
  record?: types.IRecord
  measure?: types.IMeasure
  files: types.IFile[]
  fileEvent?: types.IFileEvent
  dialog?: IDialog
  loading?: boolean
  indexing?: boolean
  updateState: (patch: Partial<State>) => void

  // Events

  onStart: () => Promise<void>
  onFileCreate: (paths: string[]) => Promise<void>
  onFileDelete: (path: string) => Promise<void>
  onFilePatch: (path: string) => Promise<void>

  // File

  loadFiles: () => Promise<void>
  addFiles: (files: FileList) => Promise<void>
  fetchFile: (url: string) => Promise<void>
  createFile: (path: string) => Promise<void>
  copyFile: (path: string, toPath: string) => Promise<void>
  deleteFile: (path: string) => Promise<void>
  moveFile: (path: string, toPath: string) => Promise<void>
  locateFile: (path: string) => Promise<void>
  selectFile: (path?: string) => Promise<void>
  openFile: (path: string) => Promise<void>
  closeFile: () => void

  // Folder

  copyFolder: (path: string, toPath: string) => Promise<void>
  createFolder: (name: string) => Promise<void>
  deleteFolder: (path: string) => Promise<void>
  moveFolder: (path: string, toPath: string) => Promise<void>

  // Others

  createArticle: (path: string) => Promise<void>
  createChart: (path: string) => Promise<void>
  createPackage: (path: string) => Promise<void>
  createScript: (path: string) => Promise<void>
  createView: (path: string) => Promise<void>
}

export function makeStore(props: ApplicationProps) {
  return createStore<State>((set, get) => ({
    files: [],
    client: props.client,
    updateState: (patch) => set(patch),

    // Events

    onStart: async () => {
      const { loadFiles, updateState } = get()
      updateState({ loading: true })
      await loadFiles()
      updateState({ loading: false })
    },
    onFileCreate: async (paths) => {
      const { loadFiles, selectFile } = get()
      await loadFiles()
      set({ fileEvent: { type: 'create', paths } })
      if (paths.length === 1) selectFile(paths[0])
      await delay(500)
      set({ fileEvent: undefined })
    },
    onFileDelete: async (path) => {
      const { loadFiles, selectFile } = get()
      set({ fileEvent: { type: 'delete', paths: [path] } })
      await delay(500)
      await loadFiles()
      selectFile(undefined)
      set({ fileEvent: undefined, record: undefined, measure: undefined })
    },
    onFilePatch: async (path) => {
      const { selectFile } = get()
      set({ fileEvent: { type: 'update', paths: [path] } })
      selectFile(path)
      await delay(500)
      set({ fileEvent: undefined })
    },

    // File

    loadFiles: async () => {
      const { client, updateState } = get()
      const { files } = await client.fileList()
      updateState({ files })
    },
    addFiles: async (files) => {
      const { client, onFileCreate } = get()
      const folder = selectors.folderPath(get())
      const paths: string[] = []
      for (const file of files) {
        const path = file.webkitRelativePath || undefined
        const result = await client.fileCreate({ file, path, folder, deduplicate: true })
        paths.push(result.path)
      }
      onFileCreate(paths)
    },
    fetchFile: async (url) => {
      const { client, onFileCreate } = get()
      const folder = selectors.folderPath(get())
      const { path } = await client.fileFetch({ url, folder, deduplicate: true })
      onFileCreate([path])
    },
    createFile: async (path) => {
      const { client, onFileCreate } = get()
      const file = new File([new Blob()], path)
      const result = await client.fileCreate({ path, file, deduplicate: true })
      onFileCreate([result.path])
    },
    copyFile: async (path, toPath) => {
      const { client, onFileCreate } = get()
      const result = await client.fileCopy({ path, toPath, deduplicate: true })
      onFileCreate([result.path])
    },
    deleteFile: async (path) => {
      const { client, onFileDelete } = get()
      await client.fileDelete({ path })
      onFileDelete(path)
    },
    moveFile: async (path, toPath) => {
      const { client, onFileCreate } = get()
      const result = await client.fileMove({ path, toPath, deduplicate: true })
      onFileCreate([result.path])
    },
    locateFile: async (path) => {
      set({ path })
      set({ fileEvent: { type: 'locate', paths: [path] } })
      await delay(500)
      set({ fileEvent: undefined })
    },
    selectFile: async (newPath) => {
      const { path, record, openFile } = get()
      if (path === newPath) return
      set({ path: newPath })
      if (!newPath) return
      if (record?.path === newPath) return
      if (selectors.isFolder(get())) return
      await openFile(newPath)
    },
    openFile: async (path) => {
      const { client, loadFiles, fileEvent } = get()
      set({ record: undefined, measure: undefined })
      set({ indexing: true })
      const { record, measure } = await client.fileIndex({ path })
      await loadFiles()
      set({ indexing: false, record, measure })
      if (!fileEvent) set({ fileEvent: { type: 'open', paths: [path] } })
      await delay(500)
      set({ fileEvent: undefined })
    },
    closeFile: () => {
      set({ record: undefined, measure: undefined })
    },

    // Folder

    copyFolder: async (path, toPath) => {
      const { client, onFileCreate } = get()
      const result = await client.folderCopy({ path, toPath, deduplicate: true })
      onFileCreate([result.path])
    },
    createFolder: async (path) => {
      const { client, onFileCreate } = get()
      const result = await client.folderCreate({ path, deduplicate: true })
      onFileCreate([result.path])
    },
    deleteFolder: async (path) => {
      const { client, onFileDelete } = get()
      await client.folderDelete({ path })
      onFileDelete(path)
    },
    moveFolder: async (path, toPath) => {
      const { client, onFileCreate } = get()
      const result = await client.folderMove({ path, toPath, deduplicate: true })
      onFileCreate([result.path])
    },

    // Others

    createArticle: async (path) => {
      const { client, onFileCreate } = get()
      const result = await client.textCreate({
        path,
        text: '',
        deduplicate: true,
      })
      onFileCreate([result.path])
    },
    createChart: async (path) => {
      const { client, onFileCreate } = get()
      const result = await client.jsonCreate({
        path,
        data: { mark: 'bar' },
        deduplicate: true,
      })
      onFileCreate([result.path])
    },
    createPackage: async (path) => {
      const { client, onFileCreate } = get()
      const result = await client.jsonCreate({
        path,
        data: settings.INITIAL_PACKAGE,
        deduplicate: true,
      })
      onFileCreate([result.path])
    },
    createScript: async (path) => {
      const { client, onFileCreate } = get()
      const result = await client.textCreate({
        path,
        text: '',
        deduplicate: true,
      })
      onFileCreate([result.path])
    },
    createView: async (path) => {
      const { client, onFileCreate } = get()
      const result = await client.jsonCreate({
        path,
        data: { query: '' },
        deduplicate: true,
      })
      onFileCreate([result.path])
    },
  }))
}

export const selectors = {
  isFolder: (state: State) => {
    return !!state.files.find(
      (file) => file.path === state.path && file.type === 'folder'
    )
  },
  folderPath: (state: State) => {
    if (!state.path) return undefined
    const isFolder = selectors.isFolder(state)
    if (isFolder) return state.path
    return helpers.getFolderPath(state.path)
  },
  notIndexedFiles: (state: State) => {
    return state.files.filter((file) => !file.indexed)
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider