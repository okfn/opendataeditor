import * as React from 'react'
import * as zustand from 'zustand'
import delay from 'delay'
import { createStore } from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { ApplicationProps } from './index'
import * as helpers from '../../../helpers'
import * as types from '../../../types'

type IDialog =
  | 'folder/copy'
  | 'folder/move'
  | 'name/create'
  | 'name/rename'
  | 'link/create'
  | 'create/dialog'

export interface State {
  path?: string
  client: Client
  record?: types.IRecord
  files: types.IFile[]
  fileEvent?: types.IFileEvent
  dialog?: IDialog
  loading?: boolean
  indexing?: boolean
  updateState: (patch: Partial<State>) => void

  // Lifecycle

  onStart: () => Promise<void>
  onFileCreate: (paths: string[]) => Promise<void>
  onFileDelete: (path: string) => Promise<void>
  onFilePatch: (path: string) => Promise<void>

  // File

  selectFile: (path?: string) => Promise<void>
  loadFiles: () => Promise<void>
  createFiles: (files: FileList) => Promise<void>
  copyFile: (folder?: string) => Promise<void>
  deleteFile: () => Promise<void>
  moveFile: (folder?: string) => Promise<void>
  renameFile: (name: string) => Promise<void>

  // Folder

  createFolder: (name: string) => Promise<void>
  uploadFolder: (files: FileList) => Promise<void>

  // Others

  fetchLink: (url: string) => Promise<void>
  createPackage: () => Promise<void>
  createChart: () => Promise<void>
  createView: () => Promise<void>
}

export function makeStore(props: ApplicationProps) {
  return createStore<State>((set, get) => ({
    files: [],
    client: props.client,
    updateState: (patch) => set(patch),

    // Lifecycle

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
    },
    onFileDelete: async (path) => {
      const { loadFiles, selectFile } = get()
      set({ fileEvent: { type: 'delete', paths: [path] } })
      await delay(500)
      await loadFiles()
      selectFile(undefined)
    },
    onFilePatch: async (path) => {
      const { selectFile } = get()
      set({ fileEvent: { type: 'update', paths: [path] } })
      selectFile(path)
    },

    // File

    selectFile: async (path) => {
      const { client, loadFiles } = get()
      set({ path, record: undefined })
      if (!path) return
      if (selectors.isFolder(get())) return
      set({ indexing: true })
      const { record } = await client.fileIndex({ path })
      await loadFiles()
      set({ indexing: false, record })
    },
    loadFiles: async () => {
      const { client, updateState } = get()
      const { files } = await client.fileList()
      updateState({ files })
    },
    createFiles: async (files) => {
      const paths: string[] = []
      const { client, onFileCreate } = get()
      for (const file of files) {
        const folder = selectors.folderPath(get())
        const { path } = await client.fileCreate({ file, folder, deduplicate: true })
        paths.push(path)
      }
      onFileCreate(paths)
    },
    copyFile: async (folder) => {
      const { client, path, onFileCreate } = get()
      if (!path) return
      const result = await client.fileCopy({ path, toPath: folder })
      onFileCreate([result.path])
    },
    deleteFile: async () => {
      const { client, path, onFileDelete } = get()
      if (!path) return
      await client.fileDelete({ path })
      onFileDelete(path)
    },
    moveFile: async (folder) => {
      const { client, path, onFileCreate } = get()
      if (!path) return
      const result = await client.fileMove({ path, toPath: folder })
      onFileCreate([result.path])
    },
    renameFile: async (name) => {
      const { client, path, onFileCreate } = get()
      if (!path) return
      const result = await client.fileMove({ path, newName: name })
      onFileCreate([result.path])
    },

    // Folder

    createFolder: async (name) => {
      const { client, onFileCreate } = get()
      const folder = selectors.folderPath(get())
      const { path } = await client.folderCreate({ path: name, folder })
      onFileCreate([path])
    },
    uploadFolder: async (files) => {
      const { path, client, onFileCreate } = get()
      let filesList: { [key: string]: any }[] = []
      let basePath
      const fileParts = files[0].webkitRelativePath.split('/')
      if (fileParts.length > 1) {
        basePath = await client.folderCreate({ path: fileParts[0], folder: path })
      }
      for (const file of files) {
        let folders = helpers.getFolderList(file)
        // remove duplicate
        folders = folders.filter(
          (item) =>
            !filesList.find(
              (file) => file.name === item.name && file.folder === item.folder
            )
        )
        filesList = filesList.concat(folders)
      }
      for (const file of filesList) {
        // handle duplicate folder upload
        const folderParts = file.folder.split('/')
        folderParts[0] = basePath?.path
        const folder = folderParts.join('/')
        if (file.type === 'folder') {
          await client.folderCreate({ path: file.name, folder: folder })
          continue
        }
        await client.fileCreate({ file: file.file, folder: folder })
      }
      if (path) onFileCreate([path])
    },

    // Others

    fetchLink: async (url) => {
      const { client, onFileCreate } = get()
      const folder = selectors.folderPath(get())
      const { path } = await client.linkFetch({ url, folder, deduplicate: true })
      onFileCreate([path])
    },
    createPackage: async () => {
      // const { client, onFileCreate } = get()
      // const { path } = await client.packageCreate()
      // onFileCreate(path)
    },
    // TODO: rewrite this method
    createChart: async () => {
      // const { record, client, onDraft } = get()
      // let path
      // let chart
      // if (record?.type === 'table') {
      // path = `${record.resource.name}.chart.json`
      // chart = {
      // data: { url: record.path },
      // mark: 'bar',
      // encoding: {},
      // width: 600,
      // height: 200,
      // }
      // const { columns } = await client.columnList()
      // for (const column of columns) {
      // if (column.tablePath !== record.path) continue
      // if (column.type === 'string') {
      // // @ts-ignore
      // chart.encoding.x = { column: column.name, type: 'nominal' }
      // }
      // if (['integer', 'number'].includes(column.type)) {
      // // @ts-ignore
      // chart.encoding.y = { column: column.name, type: 'quantitative' }
      // }
      // // @ts-ignore
      // if (chart.encoding.x && chart.encoding.y) break
      // }
      // }
      // const result = await client.chartCreate({ path, chart })
      // onDraft(result.path)
    },
    createView: async () => {
      // const { client, onDraft } = get()
      // const { path } = await client.viewCreate()
      // onDraft(path)
    },
  }))
}

export const selectors = {
  file: (state: State) => {
    return state.files.find((file) => file.path === state.path)
  },
  filePaths: (state: State) => {
    return state.files.filter((file) => file.type === 'folder').map((file) => file.path)
  },
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
  fileTree: (state: State) => {
    return helpers.createFileTree(state.files)
  },
  targetTree: (state: State) => {
    const fileTree = helpers.createFileTree(state.files, ['folder'])
    const targetTree: types.ITreeItem[] = [
      { name: 'Project', path: '/', type: 'folder', children: fileTree },
    ]
    return targetTree
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
