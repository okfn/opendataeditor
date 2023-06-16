import * as React from 'react'
import * as zustand from 'zustand'
import noop from 'lodash/noop'
import isEqual from 'fast-deep-equal'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { MetadataProps } from './index'
import * as helpers from '../../../helpers'
import * as types from '../../../types'

export interface State {
  path: string
  client: Client
  onSave: () => void
  onSaveAs: (path: string) => void
  panel?: 'report' | 'source'
  dialog?: 'saveAs' | 'resource' | 'publish'
  record?: types.IRecord
  report?: types.IReport
  measure?: types.IMeasure
  original?: types.IPackage | types.IResource | types.IDialect | types.ISchema
  modified?: types.IPackage | types.IResource | types.IDialect | types.ISchema
  updateState: (patch: Partial<State>) => void
  load: () => Promise<void>
  clear: () => void
  revert: () => void
  save: () => Promise<void>
  saveAs: (path: string) => Promise<void>

  // Package

  addResources: (paths: string[]) => Promise<void>

  // Publish

  controlType: string
  ckanControl?: Partial<types.ICkanControl>
  isPublishing?: boolean
  publishedPath?: string
  updateControl: (patch: Partial<types.ICkanControl>) => void
  publish: () => void
}

export function makeStore(props: MetadataProps) {
  return createStore<State>((set, get) => ({
    ...props,
    onSave: props.onSave || noop,
    onSaveAs: props.onSaveAs || noop,
    updateState: (patch) => {
      set(patch)
    },
    load: async () => {
      const { path, client } = get()
      const { record, report, measure } = await client.fileIndex({ path })
      const { data } = await client.jsonRead({ path: record.path })
      set({ record, report, measure, modified: cloneDeep(data), original: data })
    },
    clear: () => {
      const { record, updateState } = get()
      if (!record) return
      const descriptor = helpers.getInitialDescriptor(record.type)
      if (!descriptor) return
      updateState({ modified: cloneDeep(descriptor) })
    },
    revert: () => {
      const { original } = get()
      set({ modified: cloneDeep(original) })
    },
    save: async () => {
      const { path, client, modified, onSave, load } = get()
      await client.jsonPatch({ path, data: modified })
      onSave()
      load()
    },
    saveAs: async (toPath) => {
      const { path, client, modified, onSaveAs } = get()
      await client.jsonPatch({ path, toPath, data: modified })
      onSaveAs(toPath)
    },

    // Package

    addResources: async (paths) => {
      const { client, record, modified, updateState } = get()
      if (!modified || record?.type !== 'package') return
      const dpackage = modified as types.IPackage
      for (const path of paths) {
        const { record } = await client.fileIndex({ path })
        dpackage.resources.push(record.resource)
      }
      updateState({ modified: { ...dpackage } })
    },

    // Publish

    controlType: 'ckan',
    updateControl: (patch) => {
      const { ckanControl } = get()
      set({ ckanControl: { ...ckanControl, ...patch } })
    },
    // TODO: handle errors
    publish: async () => {
      const { record, client } = get()
      if (!record) return
      const control = selectors.control(get())
      if (!control) return
      set({ isPublishing: true })
      const { path } = await client.packagePublish({ path: record.path, control })
      set({ isPublishing: false, publishedPath: path })
    },
  }))
}

export const select = createSelector
export const selectors = {
  isUpdated: (state: State) => {
    return !isEqual(state.original, state.modified)
  },

  // Publish

  control: (state: State) => {
    let control
    if (state.controlType === 'ckan') {
      control = { ...state.ckanControl, type: 'ckan' }
      if (!control.baseurl) return
      if (!control.dataset) return
      if (!control.apikey) return
      return control as types.ICkanControl
    }
    return undefined
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
