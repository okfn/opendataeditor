import * as React from 'react'
import * as zustand from 'zustand'
import noop from 'lodash/noop'
import isEqual from 'fast-deep-equal'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { Client, ClientError } from '../../../client'
import { FileProps } from './index'
import * as types from '../../../types'

export interface State {
  path: string
  client: Client
  onSave: () => void
  onSaveAs: (path: string) => void
  error?: ClientError
  panel?: 'metadata' | 'report' | 'source'
  dialog?: 'publish' | 'saveAs' | 'chat' | 'leave'
  record?: types.IRecord
  report?: types.IReport
  measure?: types.IMeasure
  resource?: types.IResource
  byteSource?: ArrayBuffer
  textSource?: string
  textSourceOriginal?: string
  updateState: (patch: Partial<State>) => void

  // General

  load: () => Promise<void>
  edit: (prompt: string) => Promise<void>
  saveAs: (toPath: string) => Promise<void>
  publish: (control: types.IControl) => Promise<string | undefined>
  revert: () => void
  save: () => void
  onClickAway: () => void
}

export function makeStore(props: FileProps) {
  return createStore<State>((set, get) => ({
    ...props,
    onSaveAs: props.onSaveAs || noop,
    onSave: props.onSave || noop,
    updateState: (patch) => {
      set(patch)
    },

    // General

    load: async () => {
      const { path, client } = get()

      const result = await client.fileIndex({ path })

      if (result instanceof client.Error) {
        return set({ error: result })
      }

      const { record, report, measure } = result
      set({ record, report, measure, resource: cloneDeep(record.resource) })

      if (record.type === 'image') {
        const result = await client.fileRead({ path: record.path })

        if (result instanceof client.Error) {
          return set({ error: result })
        }

        set({ byteSource: result.bytes })
      } else if (record.type === 'map') {
        const result = await client.textRead({ path: record.path })

        if (result instanceof client.Error) {
          return set({ error: result })
        }

        set({ textSource: result.text, textSourceOriginal: result.text })
      }
    },
    edit: async (prompt) => {
      const { path, client, textSource } = get()
      if (!textSource) return

      const result = await client.textEdit({ path, text: textSource || '', prompt })

      if (result instanceof client.Error) {
        return set({ error: result })
      }

      set({ textSource: result.text })
    },
    saveAs: async (toPath) => {
      const { path, client, resource, onSaveAs } = get()
      await client.filePatch({ path, toPath, resource })
      onSaveAs(toPath)
    },
    publish: async (control) => {
      const { record, client } = get()
      const result = await client.filePublish({ path: record!.path, control })

      if (result instanceof client.Error) {
        set({ error: result })
        return
      }

      return result.url
    },
    revert: () => {
      const { record, textSourceOriginal } = get()
      if (!record) return
      set({ resource: cloneDeep(record.resource) })
      if (textSourceOriginal) set({ textSource: textSourceOriginal })
    },
    save: async () => {
      const { path, client, resource, onSave, load, textSource } = get()

      if (textSource) {
        const result = await client.jsonPatch({
          path,
          data: selectors.isDataUpdated(get()) ? JSON.parse(textSource) : undefined,
          resource: selectors.isMetadataUpdated(get()) ? resource : undefined,
        })

        if (result instanceof client.Error) {
          return set({ error: result })
        }
      } else {
        const result = await client.filePatch({ path, resource })

        if (result instanceof client.Error) {
          return set({ error: result })
        }
      }

      onSave()
      load()
    },
    onClickAway: () => {
      const { dialog, updateState } = get()
      const isUpdated = selectors.isUpdated(get())
      if (isUpdated && !dialog) updateState({ dialog: 'leave' })
    },
  }))
}

export const select = createSelector
export const selectors = {
  isUpdated: (state: State) => {
    return selectors.isDataUpdated(state) || selectors.isMetadataUpdated(state)
  },
  isDataUpdated: (state: State) => {
    return state.textSource !== state.textSourceOriginal
  },
  isMetadataUpdated: (state: State) => {
    return !isEqual(state.resource, state.record?.resource)
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
