import * as React from 'react'
import * as zustand from 'zustand'
import noop from 'lodash/noop'
import isEqual from 'fast-deep-equal'
import throttle from 'lodash/throttle'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { Client, ClientError } from '../../../client'
import { ITextEditor } from '../../Editors/Text'
import { TextProps } from './index'
import { getLanguageByFormat } from '../../../helpers'
import * as helpers from './helpers'
import * as types from '../../../types'
import dirtyJson from 'dirty-json'

export interface State {
  path: string
  client: Client
  error?: ClientError
  panel?: 'metadata' | 'report'
  dialog?: 'publish' | 'saveAs' | 'chat' | 'leave'
  editorRef: React.RefObject<ITextEditor>
  updateState: (patch: Partial<State>) => void

  // Data

  originalText?: string
  modifiedText?: string
  outputedText?: string
  minimalVersion: number
  currentVersion: number
  maximalVersion: number

  // Metadata

  record?: types.IRecord
  report?: types.IReport
  measure?: types.IMeasure
  resource?: types.IResource

  // Events

  onSave: () => void
  onSaveAs: (path: string) => void
  onClickAway: () => void

  // General

  load: () => Promise<void>
  edit: (prompt: string) => Promise<void>
  saveAs: (toPath: string) => Promise<void>
  publish: (control: types.IControl) => Promise<string | undefined>
  save: () => Promise<void>
  revert: () => void

  // Text

  clear: () => void
  undo: () => void
  redo: () => void

  // Json

  fix: () => void
  minify: () => void
  prettify: () => void

  // Article

  render: () => void

  // Script

  execute: () => Promise<void>
}

export function makeStore(props: TextProps) {
  return createStore<State>((set, get) => ({
    ...props,
    editorRef: React.createRef<ITextEditor>(),
    updateState: (patch) => set(patch),

    // Data

    minimalVersion: 1,
    currentVersion: 1,
    maximalVersion: 1,

    // Events

    onSave: props.onSave || noop,
    onSaveAs: props.onSaveAs || noop,
    onClickAway: () => {
      const { dialog, updateState } = get()
      const isUpdated = selectors.isUpdated(get())
      if (isUpdated && !dialog) updateState({ dialog: 'leave' })
    },

    // General

    load: async () => {
      const { path, client, render } = get()

      const indexResult = await client.fileIndex({ path })
      if (indexResult instanceof client.Error) return set({ error: indexResult })
      const { record, report, measure } = indexResult

      const readResult = await client.textRead({ path: record.path })
      if (readResult instanceof client.Error) return set({ error: readResult })
      const { text } = readResult

      set({
        record,
        report,
        measure,
        resource: cloneDeep(record.resource),
        modifiedText: text,
        originalText: text,
      })
      render()
    },
    edit: async (prompt) => {
      const { path, client, modifiedText, editorRef } = get()
      const result = await client.textEdit({ path, text: modifiedText || '', prompt })

      if (result instanceof client.Error) {
        return set({ error: result })
      }

      if (!editorRef.current) return
      editorRef.current.setValue(result.text)
    },
    saveAs: async (toPath) => {
      const { path, client, modifiedText, resource, onSaveAs } = get()
      const result = await client.textPatch({
        path,
        toPath,
        text: modifiedText,
        resource,
      })

      if (result instanceof client.Error) {
        return set({ error: result })
      }

      onSaveAs(toPath)
    },
    publish: async (control) => {
      const { record, client } = get()
      if (!record) return
      const action =
        record.type === 'article'
          ? client.articlePublish.bind(client)
          : client.filePublish.bind(client)
      const result = await action({ path: record.path, control })

      if (result instanceof client.Error) {
        set({ error: result })
        return
      }

      return result.url
    },
    revert: () => {
      const { record, originalText, updateState, editorRef } = get()
      if (!record) return
      if (!editorRef.current) return
      editorRef.current.setValue(originalText || '')
      updateState({ resource: cloneDeep(record.resource) })
    },
    save: async () => {
      const { path, client, modifiedText, resource, onSave, load } = get()
      const result = await client.textPatch({
        path,
        text: selectors.isDataUpdated(get()) ? modifiedText : undefined,
        resource: selectors.isMetadataUpdated(get()) ? resource : undefined,
      })

      if (result instanceof client.Error) {
        return set({ error: result })
      }

      onSave()
      load()
    },

    // Text

    clear: () => {
      const { updateState } = get()
      updateState({ modifiedText: '' })
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

    // Article

    render: throttle(async () => {
      const { record, client, modifiedText } = get()
      if (!record) return
      if (!modifiedText) return
      if (record.type === 'article') {
        const result = await client.articleRender({
          path: record.path,
          text: modifiedText,
        })

        if (result instanceof client.Error) {
          return set({ error: result })
        }

        set({ outputedText: result.text })
      }
    }, 1000),

    // Script

    execute: async () => {
      const { record, client, modifiedText } = get()
      if (!record) return
      if (!modifiedText) return
      const result = await client.scriptExecute({
        path: record.path,
        text: modifiedText,
      })

      if (result instanceof client.Error) {
        return set({ error: result })
      }

      set({ outputedText: result.text })
    },
  }))
}

export const select = createSelector
export const selectors = {
  isUpdated: (state: State) => {
    return selectors.isDataUpdated(state) || selectors.isMetadataUpdated(state)
  },
  isDataUpdated: (state: State) => {
    return !isEqual(state.originalText, state.modifiedText)
  },
  isMetadataUpdated: (state: State) => {
    return !isEqual(state.resource, state.record?.resource)
  },
  language: (state: State) => {
    const resource = state.record?.resource
    if (!resource) return undefined
    return getLanguageByFormat(resource.format) || 'plaintext'
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
