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
import { ITextEditor } from '../../Parts/Text'
import { TextProps } from './index'
import * as helpers from './helpers'
import * as types from '../../../types'
import dirtyJson from 'dirty-json'

export interface State {
  path: string
  client: Client
  panel?: 'metadata' | 'report'
  dialog?: 'saveAs'
  editorRef: React.RefObject<ITextEditor>
  updateState: (patch: Partial<State>) => void

  // Data

  originalText?: string
  modifiedText?: string
  renderedText?: string
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

  // General

  load: () => Promise<void>
  revert: () => void
  save: () => Promise<void>
  saveAs: (toPath: string) => Promise<void>
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
    editorRef: React.createRef<ITextEditor>(),
    updateState: (patch) => set(patch),

    // Data

    minimalVersion: 1,
    currentVersion: 1,
    maximalVersion: 1,

    // Events

    onSave: props.onSave || noop,
    onSaveAs: props.onSaveAs || noop,

    // General

    load: async () => {
      const { path, client, render } = get()
      const { record, report, measure } = await client.fileIndex({ path })
      const { text } = await client.textRead({ path: record.path })
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
    revert: () => {
      const { record, originalText, updateState } = get()
      if (!record) return
      updateState({
        resource: cloneDeep(record.resource),
        modifiedText: originalText,
      })
    },
    save: async () => {
      const { path, client, modifiedText, resource, onSave, load } = get()
      await client.textPatch({
        path,
        text: selectors.isDataUpdated(get()) ? modifiedText : undefined,
        resource: selectors.isMetadataUpdated(get()) ? resource : undefined,
      })
      onSave()
      load()
    },
    saveAs: async (toPath) => {
      const { path, client, modifiedText, resource, onSaveAs } = get()
      await client.textPatch({ path, toPath, text: modifiedText, resource })
      onSaveAs(toPath)
    },
    render: throttle(async () => {
      const { record, client, modifiedText } = get()
      if (!record) return
      if (record.type === 'article') {
        const { text } = await client.articleRender({ text: modifiedText || '' })
        set({ renderedText: text })
      }
    }, 1000),

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
    switch (resource.format) {
      case 'json':
        return 'json'
      case 'geojson':
        return 'json'
      case 'topojson':
        return 'json'
      case 'yaml':
        return 'yaml'
      case 'md':
        return 'markdown'
      case 'py':
        return 'python'
      case 'js':
        return 'javascript'
      case 'r':
        return 'r'
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
