import * as React from 'react'
import * as zustand from 'zustand'
import { createStore } from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IRecord, IFile, ITreeItem, IFileEvent } from '../../../interfaces'
import { ApplicationProps } from './Application'
import * as helpers from '../../../helpers'

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
  record?: IRecord
  files: IFile[]
  fileEvent?: IFileEvent
  dialog?: IDialog
  loading?: boolean
  indexing?: boolean
  updateState: (patch: Partial<State>) => void
  onCreate: (path: string) => Promise<void>
  onDelete: (path: string) => Promise<void>
  onDraft: (path: string) => Promise<void>
  onUpdate: (path: string) => Promise<void>
  load: () => Promise<void>
  select: (path?: string) => Promise<void>
  revert: () => Promise<void>

  // File

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
    client: props.client,
    files: [],
    updateState: (patch) => {
      set(patch)
    },
    onCreate: async (path) => {
      const { select } = get()
      set({ fileEvent: { type: 'create', paths: [path] } })
      select(path)
    },
    onDelete: async (path) => {
      const { select } = get()
      set({ fileEvent: { type: 'delete', paths: [path] } })
      setTimeout(() => select(undefined), 500)
    },
    onDraft: async (path) => {
      const { select } = get()
      set({ fileEvent: { type: 'draft', paths: [path] } })
      select(path)
    },
    onUpdate: async (path) => {
      const { select } = get()
      set({ fileEvent: { type: 'update', paths: [path] } })
      select(path)
    },
    load: async () => {
      const { client, updateState } = get()
      updateState({ loading: true })
      const { files } = await client.fileList()
      updateState({ loading: false, files })
    },
    select: async (path) => {
      const { client, load } = get()
      set({ path, record: undefined })
      if (!path) return
      if (selectors.isFolder(get())) return
      set({ indexing: true })
      const { record } = await client.fileIndex({ path })
      set({ record, indexing: false })
      await load()
    },
    revert: async () => {
      const { path, client, fileEvent, onDelete } = get()
      if (fileEvent?.type !== 'draft') return
      if (!path) return
      await client.fileDelete({ path })
      onDelete(path)
    },

    // File

    createFiles: async (files) => {
      const paths: string[] = []
      const { client, load, select } = get()
      for (const file of files) {
        const folder = selectors.folderPath(get())
        const result = await client.fileCreate({ file, folder })
        paths.push(result.path)
      }
      if (!paths.length) return
      await load()
      if (paths.length === 1) select(paths[0])
      set({ fileEvent: { type: 'create', paths } })
    },
    copyFile: async (folder) => {
      const { client, path, onCreate } = get()
      if (!path) return
      const result = await client.fileCopy({ path, toPath: folder })
      onCreate(result.path)
    },
    deleteFile: async () => {
      const { client, path, onDelete } = get()
      if (!path) return
      const result = await client.fileDelete({ path })
      onDelete(result.path)
    },
    moveFile: async (folder) => {
      const { client, path, onCreate } = get()
      if (!path) return
      const result = await client.fileMove({ path, toPath: folder })
      onCreate(result.path)
    },
    renameFile: async (name) => {
      const { client, path, onCreate } = get()
      if (!path) return
      const result = await client.fileMove({ path, newName: name })
      onCreate(result.path)
    },

    // Folder

    createFolder: async (name) => {
      const { client, onCreate } = get()
      const folder = selectors.folderPath(get())
      const { path } = await client.folderCreate({ path: name, folder })
      onCreate(path)
    },
    uploadFolder: async (files) => {
      const { path, client, onCreate } = get()
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
      if (path) onCreate(path)
    },

    // Others

    fetchLink: async (url) => {
      const { client, onCreate } = get()
      const folder = selectors.folderPath(get())
      const result = await client.linkFetch({ url, folder, deduplicate: true })
      onCreate(result.path)
    },
    createPackage: async () => {
      const { client, onCreate } = get()
      const { path } = await client.packageCreate()
      onCreate(path)
    },
    // TODO: rewrite this method
    createChart: async () => {
      const { record, client, onDraft } = get()
      let path
      let chart
      if (record?.type === 'table') {
        path = `${record.resource.name}.chart.json`
        chart = {
          data: { url: record.path },
          mark: 'bar',
          encoding: {},
          width: 600,
          height: 200,
        }
        const { columns } = await client.columnList()
        for (const column of columns) {
          if (column.tablePath !== record.path) continue
          if (column.type === 'string') {
            // @ts-ignore
            chart.encoding.x = { column: column.name, type: 'nominal' }
          }
          if (['integer', 'number'].includes(column.type)) {
            // @ts-ignore
            chart.encoding.y = { column: column.name, type: 'quantitative' }
          }
          // @ts-ignore
          if (chart.encoding.x && chart.encoding.y) break
        }
      }
      const result = await client.chartCreate({ path, chart })
      onDraft(result.path)
    },
    createView: async () => {
      const { client, onDraft } = get()
      const { path } = await client.viewCreate()
      onDraft(path)
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
    const targetTree: ITreeItem[] = [
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
