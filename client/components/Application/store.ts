import * as React from 'react'
import * as zustand from 'zustand'
import delay from 'delay'
import { createStore } from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import { Client } from '../../client'
import { ApplicationProps } from './index'
import { IDialog } from './types'
import * as helpers from '../../helpers'
import * as types from '../../types'

export interface State {
  paths?: string[]
  client: Client
  config?: types.IConfig
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

  // Project

  openProject: (fullpath: string) => Promise<void>

  // Config

  loadConfig: () => Promise<void>
  saveConfig: (config: types.IConfig) => Promise<void>

  // File

  loadFiles: () => Promise<void>
  addFiles: (files: FileList) => Promise<void>
  fetchFile: (url: string) => Promise<void>
  createFile: (path: string, prompt?: string) => Promise<void>
  adjustFile: (name?: string, type?: string) => Promise<void>
  copyFile: (path: string, toPath: string) => Promise<void>
  deleteFile: (paths: string[]) => Promise<void>
  moveFile: (path: string, toPath: string) => Promise<void>
  locateFile: (path: string) => Promise<void>
  selectFile: (paths?: string[]) => Promise<void>
  openFile: (path: string) => Promise<void>
  closeFile: () => void

  // Folder

  copyFolder: (path: string, toPath: string) => Promise<void>
  createFolder: (name: string) => Promise<void>
  deleteFolder: (path: string) => Promise<void>
  moveFolder: (path: string, toPath: string) => Promise<void>

  // Others

  createArticle: (path: string, prompt?: string) => Promise<void>
  createChart: (path: string, prompt?: string) => Promise<void>
  createImage: (path: string, prompt?: string) => Promise<void>
  createMap: (path: string, prompt?: string) => Promise<void>
  createPackage: (path: string, prompt?: string) => Promise<void>
  fetchPackage: (url: string) => Promise<void>
  createScript: (path: string, prompt?: string) => Promise<void>
  createTable: (path: string, prompt?: string) => Promise<void>
  createView: (path: string, prompt?: string) => Promise<void>
}

export function makeStore(props: ApplicationProps) {
  return createStore<State>((set, get) => ({
    files: [],
    client: props.client,
    updateState: (patch) => set(patch),

    // Events

    onStart: async () => {
      const { client, loadConfig, loadFiles, updateState } = get()
      // @ts-ignore
      const sendFatalError = window?.opendataeditor?.sendFatalError
      updateState({ dialog: 'start' })
      let ready = false
      let attempt = 0
      const maxAttempts = sendFatalError ? 300 : 3
      const delaySeconds = 1
      while (!ready) {
        try {
          await loadConfig()
          await loadFiles()
          ready = true
        } catch (error) {
          attempt += 1
          if (attempt >= maxAttempts) {
            const serverUrl = await client.readServerUrl()
            const message = `Client cannot connect to server on "${serverUrl}"`
            sendFatalError ? sendFatalError(message) : alert(message)
          }
          await delay(delaySeconds * 1000)
        }
      }
      updateState({ dialog: undefined })
    },
    onFileCreate: async (paths) => {
      const { loadFiles, selectFile } = get()
      await loadFiles()
      set({ fileEvent: { type: 'create', paths } })
      if (paths.length === 1) selectFile(paths)
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
      selectFile([path])
      await delay(500)
      set({ fileEvent: undefined })
    },

    // Project

    openProject: async (fullpath) => {
      const { client, updateState, closeFile, loadConfig, loadFiles } = get()
      closeFile()
      updateState({ loading: true })
      await client.projectOpen({ fullpath })
      await loadConfig()
      await loadFiles()
      updateState({ loading: false })
    },

    // Config

    loadConfig: async () => {
      const { client, updateState } = get()
      const { config } = await client.configRead()
      updateState({ config })
    },

    saveConfig: async (config) => {
      const { client, loadConfig } = get()
      await client.configWrite({ config })
      await loadConfig()
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
    createFile: async (path, prompt) => {
      const { client, onFileCreate } = get()
      if (prompt) {
        const text = ''
        const result = await client.textCreate({ path, text, prompt, deduplicate: true })
        onFileCreate([result.path])
      } else {
        const file = new File([new Blob()], path)
        const result = await client.fileCreate({ path, file, deduplicate: true })
        onFileCreate([result.path])
      }
    },
    adjustFile: async (name, type) => {
      const { paths, client, closeFile, loadFiles, selectFile } = get()
      // only adjust file if one file is selected from menu
      if (!paths || paths.length !== 1) return
      await client.filePatch({ path: paths[0], name, type })
      set({ paths: undefined })
      closeFile()
      await loadFiles()
      await selectFile(paths)
    },
    copyFile: async (path, toPath) => {
      const { client, onFileCreate } = get()
      const result = await client.fileCopy({ path, toPath, deduplicate: true })
      onFileCreate([result.path])
    },
    deleteFile: async (paths) => {
      const { client, onFileDelete } = get()
      for (const path of paths) {
        await client.fileDelete({ path })
        onFileDelete(path)
      }
    },
    moveFile: async (path, toPath) => {
      const { client, onFileCreate } = get()
      const result = await client.fileMove({ path, toPath, deduplicate: true })
      onFileCreate([result.path])
    },
    locateFile: async (path) => {
      set({ paths: [path] })
      set({ fileEvent: { type: 'locate', paths: [path] } })
      await delay(500)
      set({ fileEvent: undefined })
    },
    selectFile: async (newPaths) => {
      console.log('selectFile called with', newPaths)
      const isSingleFile = newPaths && newPaths.length === 1
      const { paths, record, openFile } = get()
      if (paths === newPaths) return
      set({ paths: newPaths })
      if (!newPaths) return
      if (record?.path === newPaths[0]) return
      if (selectors.isFolder(get())) return
      if (isSingleFile) {
        await openFile(newPaths[0])
      } else return
    },
    openFile: async (path) => {
      console.log('openFile', path)
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

    createArticle: async (path, prompt) => {
      const { client, onFileCreate } = get()
      const result = await client.articleCreate({
        path,
        prompt,
        deduplicate: true,
      })
      onFileCreate([result.path])
    },
    createChart: async (path, prompt) => {
      const { client, onFileCreate } = get()
      const result = await client.chartCreate({
        path,
        prompt,
        deduplicate: true,
      })
      onFileCreate([result.path])
    },
    createImage: async (path, prompt) => {
      const { client, onFileCreate } = get()
      const result = await client.imageCreate({
        path,
        prompt,
        deduplicate: true,
      })
      onFileCreate([result.path])
    },
    createMap: async (path, prompt) => {
      const { client, onFileCreate } = get()
      const result = await client.mapCreate({
        path,
        prompt,
        deduplicate: true,
      })
      onFileCreate([result.path])
    },
    createPackage: async (path, prompt) => {
      const { client, onFileCreate } = get()
      const result = await client.packageCreate({
        path,
        prompt,
        deduplicate: true,
      })
      onFileCreate([result.path])
    },
    fetchPackage: async (url) => {
      const { client, onFileCreate } = get()
      const folder = selectors.folderPath(get())
      const { path } = await client.packageFetch({ url, folder, deduplicate: true })
      onFileCreate([path])
    },
    createScript: async (path, prompt) => {
      const { client, onFileCreate } = get()
      const result = await client.scriptCreate({
        path,
        prompt,
        deduplicate: true,
      })
      onFileCreate([result.path])
    },
    createTable: async (path, prompt) => {
      const { client, onFileCreate } = get()
      const result = await client.textCreate({
        path,
        text: '',
        prompt,
        deduplicate: true,
      })
      onFileCreate([result.path])
    },
    createView: async (path, prompt) => {
      const { client, onFileCreate } = get()
      const result = await client.viewCreate({
        path,
        prompt,
        deduplicate: true,
      })
      onFileCreate([result.path])
    },
  }))
}

export const selectors = {
  isFolder: (state: State) => {
    const path = state.paths ? state.paths[0] : null
    return !!state.files.find((file) => file.path === path && file.type === 'folder')
  },
  folderPath: (state: State) => {
    if (!state.paths) return undefined
    const isFolder = selectors.isFolder(state)
    if (isFolder) return state.paths[0]
    return helpers.getFolderPath(state.paths[0])
  },
  notIndexedFiles: (state: State) => {
    return state.files.filter((file) => !file.name)
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
