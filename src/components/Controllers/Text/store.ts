import * as React from 'react'
import * as zustand from 'zustand'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { IFile, IResource } from '../../../interfaces'
import { IMonacoEditor } from '../../Parts/Monaco/Editor'
import { TextProps } from './Text'
import * as helpers from './helpers'
// @ts-expect-error
import dirtyJson from 'dirty-json'

export interface State {
  file: IFile
  client: Client
  panel?: 'metadata' | 'report' | 'source'
  dialog?: 'saveAs'
  original?: string
  modified?: string
  rendered?: string
  resource: IResource
  revision: number
  editor: React.RefObject<IMonacoEditor>
  updateState: (patch: Partial<State>) => void
  load: () => Promise<void>
  saveAs: (path: string) => Promise<void>
  revert: () => void
  save: () => Promise<void>

  // Text

  clear: () => void

  // Json

  fix: () => void
  minify: () => void
  prettify: () => void
}

export function makeStore(props: TextProps) {
  return createStore<State>((set, get) => ({
    ...props,
    revision: 0,
    // TODO: review case of missing record (not indexed)
    resource: cloneDeep(props.file.record!.resource),
    editor: React.createRef<IMonacoEditor>(),
    updateState: (patch) => {
      const { revision } = get()
      if ('resource' in patch) patch.revision = revision + 1
      set(patch)
    },
    load: async () => {
      const { client, file } = get()
      const { text } = await client.textRead({ path: file.path })
      set({ modified: text, original: text })
      if (file.record?.resource.format === 'md') {
        const { text } = await client.textRender({ path: file.path })
        set({ rendered: text })
      }
    },
    saveAs: async (path) => {
      const { client, modified } = get()
      await client.textWrite({ path, text: modified! })
    },
    revert: () => {
      const { file, original } = get()
      // TODO: review case of missing record (not indexed)
      set({ resource: cloneDeep(file.record!.resource), modified: original, revision: 0 })
    },
    // TODO: needs to udpate file object as well
    save: async () => {
      const { file, client, modified, resource } = get()
      await client.fileUpdate({ path: file.path, resource })
      await client.textWrite({ path: file.path, text: modified! })
      set({ original: modified, revision: 0 })
      if (file.record?.resource.format === 'md') {
        const { text } = await client.textRender({ path: file.path })
        set({ rendered: text })
      }
    },

    // Text

    clear: () => {
      const { editor } = get()
      if (!editor.current) return
      editor.current.setValue('')
    },

    // Json

    fix: () => {
      const { editor } = get()
      if (!editor.current) return
      const value = editor.current.getValue()
      const fixedValue = value && dirtyJson.parse(value)
      const formattedValue =
        fixedValue && helpers.prettifyJsonString(JSON.stringify(fixedValue))
      editor.current.setValue(formattedValue)
    },
    minify: () => {
      const { editor } = get()
      if (!editor.current) return
      const value = editor.current.getValue()
      if (!value) return
      const minifiedValue = helpers.minifyJsonString(value)
      editor.current.setValue(minifiedValue)
    },
    prettify: () => {
      const { editor } = get()
      if (!editor.current) return
      const action = editor.current.getAction('editor.action.formatDocument')
      if (!action) return
      action.run()
    },
  }))
}

export const select = createSelector
export const selectors = {
  isUpdated: (state: State) => {
    return state.revision > 0 || state.original !== state.modified
  },
  language: (state: State) => {
    switch (state.file.record?.resource.format) {
      case 'json':
        return 'json'
      case 'yaml':
        return 'yaml'
      case 'md':
        return 'markdown'
      default:
        return 'plaintext'
    }
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
