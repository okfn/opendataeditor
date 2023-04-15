import * as React from 'react'
import * as zustand from 'zustand'
import { createStore } from 'zustand/vanilla'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { FilesProps } from './Files'
import { IFileItem, IFileEvent, ITreeItem } from '../../../interfaces'
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
  fileEvent?: IFileEvent
  fileItems: IFileItem[]
  onFileSelect: (path?: string) => void
  dialog?: IDialog
  updateState: (patch: Partial<State>) => void
  updatePath: (path?: string) => void
  loading?: boolean
  open?: boolean

  // File

  copyFile: (folder?: string) => Promise<void>
  deleteFile: () => Promise<void>
  listFiles: () => Promise<void>
  moveFile: (folder?: string) => Promise<void>
  renameFile: (name: string) => Promise<void>
  uploadFiles: (files: FileList) => Promise<void>
  createFile: (url: string) => Promise<void>
  uploadFolder: (files: FileList) => Promise<void>
  downloadFile: () => Promise<ArrayBuffer | undefined>
  countFiles: () => Promise<number>

  // Folder

  createFolder: (name: string) => Promise<void>

  // Package

  createPackage: () => Promise<void>
}

export function makeStore(props: FilesProps) {
  return createStore<State>((set, get) => ({
    client: props.client,
    fileItems: [],
    onFileSelect: props.onFileSelect,
    fileEvent: props.fileEvent,
    loading: true,
    updateState: (patch) => {
      set(patch)
    },
    updatePath: (path) => {
      const { onFileSelect } = get()
      set({ path })
      if (!selectors.isFolder(get())) onFileSelect(path)
    },

    // File

    copyFile: async (folder) => {
      const { client, path, listFiles } = get()
      if (!path) return
      await client.fileCopy({ path, folder })
      await listFiles()
    },
    deleteFile: async () => {
      const { client, path, listFiles, updatePath } = get()
      if (!path) return
      await client.fileDelete({ path })
      await listFiles()
      updatePath(undefined)
    },
    listFiles: async () => {
      const { client } = get()
      const { items } = await client.fileList()
      set({ fileItems: items })
      set({ loading: false })
    },
    moveFile: async (folder) => {
      const { client, path, listFiles } = get()
      if (!path) return
      await client.fileMove({ path, folder })
      await listFiles()
    },
    renameFile: async (name) => {
      const { client, path, listFiles } = get()
      if (!path) return
      await client.fileRename({ path, name })
      await listFiles()
    },
    // TODO: upload in parallel?
    uploadFiles: async (files) => {
      const paths: string[] = []
      const { client, listFiles, updatePath } = get()
      for (const file of files) {
        const folder = selectors.folderPath(get())
        const result = await client.fileUpload({ file, folder })
        paths.push(result.path)
      }
      if (!paths.length) return
      await listFiles()
      if (paths.length === 1) updatePath(paths[0])
      set({ fileEvent: { type: 'create', paths } })
    },
    createFile: async (path) => {
      const { client, listFiles, updatePath } = get()
      const folder = selectors.folderPath(get())
      const result = await client.fileCreate({ path, folder })
      if (!result.path) return
      await listFiles()
      updatePath(result.path)
      set({ fileEvent: { type: 'create', paths: [result.path] } })
    },
    uploadFolder: async (files) => {
      const { path, client, listFiles, updatePath } = get()
      let filesList: { [key: string]: any }[] = []
      let basePath
      const fileParts = files[0].webkitRelativePath.split('/')
      if (fileParts.length > 1) {
        basePath = await client.folderCreate({ name: fileParts[0], folder: path })
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
          await client.folderCreate({ name: file.name, folder: folder })
          continue
        }
        await client.fileUpload({ file: file.file, folder: folder })
      }
      await listFiles()
      updatePath(path)
    },
    downloadFile: async () => {
      const { client, path } = get()
      if (!path) return
      const { bytes } = await client.fileRead({ path })
      return bytes
    },
    countFiles: async () => {
      const { client } = get()
      const { count } = await client.fileCount()
      return count
    },

    // Folder

    createFolder: async (name) => {
      const { client, listFiles } = get()
      const folder = selectors.folderPath(get())
      const { path } = await client.folderCreate({ name, folder })
      await listFiles()
      set({ fileEvent: { type: 'create', paths: [path] } })
    },

    // Package

    createPackage: async () => {
      const { client, listFiles, updatePath } = get()
      const { path } = await client.packageCreate()
      await listFiles()
      set({ fileEvent: { type: 'create', paths: [path] } })
      updatePath(path)
    },
  }))
}

export const selectors = {
  fileItem: (state: State) => {
    return state.fileItems.find((item) => item.path === state.path)
  },
  filePaths: (state: State) => {
    return state.fileItems
      .filter((item) => item.type === 'folder')
      .map((item) => item.path)
  },
  isFolder: (state: State) => {
    return !!state.fileItems.find(
      (item) => item.path === state.path && item.type === 'folder'
    )
  },
  folderPath: (state: State) => {
    if (!state.path) return undefined
    const isFolder = selectors.isFolder(state)
    if (isFolder) return state.path
    return helpers.getFolderPath(state.path)
  },
  fileTree: (state: State) => {
    return helpers.createFileTree(state.fileItems)
  },
  targetTree: (state: State) => {
    const fileTree = helpers.createFileTree(state.fileItems, ['folder'])
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
