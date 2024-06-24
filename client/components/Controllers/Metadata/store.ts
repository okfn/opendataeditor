import * as React from 'react'
import * as zustand from 'zustand'
import noop from 'lodash/noop'
import isEqual from 'fast-deep-equal'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { Client, ClientError } from '../../../client'
import { MetadataProps } from './index'
import * as helpers from '../../../helpers'
import * as types from '../../../types'

export interface State {
  path: string
  client: Client
  onSave: () => void
  onSaveAs: (path: string) => void
  error?: ClientError
  panel?: 'report' | 'source'
  dialog?: 'publish' | 'saveAs' | 'resource' | 'chat' | 'leave'
  record?: types.IRecord
  report?: types.IReport
  measure?: types.IMeasure
  original?: types.IPackage | types.IResource | types.IDialect | types.ISchema
  modified?: types.IPackage | types.IResource | types.IDialect | types.ISchema
  updateState: (patch: Partial<State>) => void

  // General

  load: () => Promise<void>
  edit: (prompt: string) => Promise<void>
  saveAs: (toPath: string) => Promise<void>
  publish: (control: types.IControl) => Promise<string | undefined>
  revert: () => void
  save: () => Promise<void>
  clear: () => void
  onClickAway: () => void

  // Package

  addResources: (paths: string[]) => Promise<void>
}

export function makeStore(props: MetadataProps) {
  return createStore<State>((set, get) => ({
    ...props,
    onSave: props.onSave || noop,
    onSaveAs: props.onSaveAs || noop,
    updateState: (patch) => {
      set(patch)
    },

    // General

    load: async () => {
      const { path, client } = get()

      const indexResult = await client.fileIndex({ path })
      if (indexResult instanceof client.Error) return set({ error: indexResult })
      const { record, report, measure } = indexResult

      const readResult = await client.jsonRead({ path: record.path })
      if (readResult instanceof client.Error) return set({ error: readResult })
      const { data } = readResult

      set({ record, report, measure, modified: cloneDeep(data), original: data })
    },
    edit: async (prompt) => {
      const { path, client, modified, updateState } = get()
      if (!modified) return
      const result = await client.jsonEdit({ path, data: modified, prompt })

      if (result instanceof client.Error) {
        return set({ error: result })
      }

      updateState({ modified: result.data })
    },
    clear: () => {
      const { record, updateState } = get()
      if (!record) return
      const descriptor = helpers.getInitialDescriptor(record.type)
      if (!descriptor) return
      updateState({ modified: cloneDeep(descriptor) })
    },
    saveAs: async (toPath) => {
      const { path, client, modified, onSaveAs } = get()
      const result = await client.jsonPatch({ path, toPath, data: modified })

      if (result instanceof client.Error) {
        return set({ error: result })
      }

      onSaveAs(toPath)
    },
    publish: async (control) => {
      const { record, client } = get()
      if (record!.type === 'package') {
        const result = await client.packagePublish({ path: record!.path, control })

        if (result instanceof client.Error) {
          set({ error: result })
          return
        }

        return result.url
      } else {
        const result = await client.filePublish({ path: record!.path, control })

        if (result instanceof client.Error) {
          set({ error: result })
          return
        }

        return result.url
      }
    },
    revert: () => {
      const { original } = get()
      set({ modified: cloneDeep(original) })
    },
    save: async () => {
      const { path, client, modified, onSave, load } = get()
      const result = await client.jsonPatch({ path, data: modified })

      if (result instanceof client.Error) {
        return set({ error: result })
      }

      onSave()
      load()
    },
    onClickAway: () => {
      const { dialog, updateState } = get()
      const isUpdated = selectors.isUpdated(get())
      if (isUpdated && !dialog) updateState({ dialog: 'leave' })
    },

    // Package

    addResources: async (paths) => {
      const { client, record, modified, updateState } = get()
      if (!modified || record?.type !== 'package') return
      const dpackage = modified as types.IPackage
      for (const path of paths) {
        const result = await client.fileIndex({ path })

        if (result instanceof client.Error) {
          return set({ error: result })
        }

        dpackage.resources.push(result.record.resource)
      }
      updateState({ modified: { ...dpackage } })
    },
  }))
}

export const select = createSelector
export const selectors = {
  isUpdated: (state: State) => {
    return !isEqual(state.original, state.modified)
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
