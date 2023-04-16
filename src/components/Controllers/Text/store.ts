import * as React from 'react'
import * as zustand from 'zustand'
import noop from 'lodash/noop'
import isEqual from 'fast-deep-equal'
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
  path: string
  client: Client
  onSave: () => void
  onSaveAs: (path: string) => void
  panel?: 'metadata' | 'report' | 'source'
  dialog?: 'saveAs'
  file?: IFile
  resource?: IResource
  original?: string
  modified?: string
  rendered?: string
  editor: React.RefObject<IMonacoEditor>
  updateState: (patch: Partial<State>) => void
  load: () => Promise<void>
  revert: () => void
  save: () => Promise<void>
  saveAs: (path: string) => Promise<void>

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
    onSave: props.onSave || noop,
    onSaveAs: props.onSaveAs || noop,
    editor: React.createRef<IMonacoEditor>(),
    updateState: (patch) => {
      set(patch)
    },
    load: async () => {
      const { path, client } = get()
      const { file } = await client.fileIndex({ path })
      if (!file) return
      const resource = cloneDeep(file.record!.resource)
      set({ file, resource })
      const { text } = await client.textRead({ path: file.path })
      set({ modified: text, original: text })
      // Update on changes using throttle
      if (file.record?.resource.format === 'md') {
        const { text } = await client.textRender({ path: file.path })
        set({ rendered: text })
      }
    },
    revert: () => {
      const { file, original } = get()
      if (!file) return
      set({ resource: cloneDeep(file.record!.resource), modified: original })
    },
    // TODO: needs to udpate file object as well
    save: async () => {
      const { file, client, modified, resource, onSave, load } = get()
      if (!file || !resource) return
      await client.fileUpdate({ path: file.path, resource })
      await client.textWrite({ path: file.path, text: modified! })
      set({ original: modified })
      onSave()
      load()
    },
    saveAs: async (path) => {
      const { client, modified, onSaveAs } = get()
      await client.textWrite({ path, text: modified! })
      onSaveAs(path)
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
    return (
      state.original !== state.modified ||
      !isEqual(state.resource, state.file?.record!.resource)
    )
  },
  language: (state: State) => {
    const resource = state.file?.record!.resource
    if (!resource) return undefined
    switch (resource.format) {
      case 'json':
        return 'json'
      case 'yaml':
        return 'yaml'
      case 'md':
        return 'markdown'
      case 'py':
        return 'python'
      case 'js':
        return 'javascript'
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
