import * as React from 'react'
import * as zustand from 'zustand'
import noop from 'lodash/noop'
import isEqual from 'fast-deep-equal'
import throttle from 'lodash/throttle'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { ITextEditor } from '../../Parts/TextEditor'
import { TextProps } from './index'
import * as helpers from './helpers'
import * as types from '../../../types'
// @ts-ignore
import dirtyJson from 'dirty-json'

export interface State {
  path: string
  client: Client
  onSave: () => void
  onSaveAs: (path: string) => void
  panel?: 'metadata' | 'report'
  dialog?: 'saveAs'
  record?: types.IRecord
  report?: types.IReport
  resource?: types.IResource
  original?: string
  modified?: string
  rendered?: string
  editorRef: React.RefObject<ITextEditor>
  updateState: (patch: Partial<State>) => void
  load: () => Promise<void>
  revert: () => void
  save: () => Promise<void>
  saveAs: (path: string) => Promise<void>
  render: () => void

  // Text

  clear: () => void
  undo: () => void
  redo: () => void

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
    editorRef: React.createRef<ITextEditor>(),
    updateState: (patch) => {
      const { render } = get()
      set(patch)
      // TODO: stop using this pattern in favour of proper updateDescriptor/etc methods
      if ('modified' in patch) render()
    },
    load: async () => {
      const { path, client, render } = get()
      const { record } = await client.recordRead({ path })
      const { report } = await client.reportRead({ path })
      const resource = cloneDeep(record.resource)
      set({ record, report, resource })
      const { text } = await client.textRead({ path: record.path })
      set({ modified: text, original: text })
      render()
    },
    revert: () => {
      const { record, original, updateState } = get()
      if (!record) return
      updateState({ resource: cloneDeep(record.resource), modified: original })
    },
    // TODO: needs to udpate file object as well
    save: async () => {
      const { path, client, modified, resource, onSave, load } = get()
      if (!resource) return
      await client.recordPatch({ path, resource })
      await client.textWrite({ path, text: modified! })
      set({ original: modified })
      onSave()
      load()
    },
    saveAs: async (path) => {
      const { client, modified, onSaveAs } = get()
      await client.textWrite({ path, text: modified! })
      onSaveAs(path)
    },
    render: throttle(async () => {
      const { record, client, modified } = get()
      if (!record) return
      if (!modified) return
      if (record.resource.format === 'md') {
        const { text } = await client.textRender({ text: modified })
        set({ rendered: text })
      }
    }, 1000),

    // Text

    clear: () => {
      const { editorRef } = get()
      editorRef.current?.setValue('')
    },
    undo: () => {
      const { editorRef } = get()
      editorRef.current?.trigger(null, 'undo', null)
    },
    redo: () => {
      const { editorRef } = get()
      editorRef.current?.trigger(null, 'redo', null)
    },

    // Json

    fix: () => {
      const { editorRef } = get()
      if (!editorRef.current) return
      const value = editorRef.current.getValue()
      const fixedValue = value && dirtyJson.parse(value)
      const formattedValue =
        fixedValue && helpers.prettifyJsonString(JSON.stringify(fixedValue))
      editorRef.current.setValue(formattedValue)
    },
    minify: () => {
      const { editorRef } = get()
      if (!editorRef.current) return
      const value = editorRef.current.getValue()
      if (!value) return
      const minifiedValue = helpers.minifyJsonString(value)
      editorRef.current.setValue(minifiedValue)
    },
    prettify: () => {
      const { editorRef } = get()
      if (!editorRef.current) return
      const action = editorRef.current.getAction('editor.action.formatDocument')
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
      !isEqual(state.resource, state.record?.resource)
    )
  },
  language: (state: State) => {
    const resource = state.record?.resource
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
