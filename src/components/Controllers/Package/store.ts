import * as React from 'react'
import * as zustand from 'zustand'
import noop from 'lodash/noop'
import isEqual from 'fast-deep-equal'
import cloneDeep from 'lodash/cloneDeep'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { assert } from 'ts-essentials'
import { Client } from '../../../client'
import { PackageProps } from './index'
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
  original?: types.IPackage
  modified?: types.IPackage
  updateState: (patch: Partial<State>) => void
  load: () => Promise<void>
  clear: () => void
  revert: () => void
  save: () => Promise<void>
  saveAs: (path: string) => Promise<void>

  // Resources

  addResources: (paths: string[]) => Promise<void>

  // Publish

  controlType: string
  ckanControl?: Partial<types.ICkanControl>
  isPublishing?: boolean
  publishedPath?: string
  updateControl: (patch: Partial<types.ICkanControl>) => void
  publish: () => void
}

export function makeStore(props: PackageProps) {
  return createStore<State>((set, get) => ({
    ...props,
    onSaveAs: props.onSaveAs || noop,
    onSave: props.onSave || noop,
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
      const { updateState } = get()
      const descriptor = helpers.getInitialDescriptor('package') as types.IPackage
      if (!descriptor) return
      updateState({ modified: cloneDeep(descriptor) })
    },
    revert: () => {
      const { original } = get()
      set({ modified: cloneDeep(original) })
    },
    save: async () => {
      const { path, client, modified, onSave, load } = get()
      await client.packagePatch({ path, data: modified })
      onSave()
      load()
    },
    saveAs: async (toPath) => {
      const { path, client, modified, onSaveAs } = get()
      await client.packagePatch({ path, toPath, data: modified })
      onSaveAs(path)
    },

    // Resources

    addResources: async (paths) => {
      const { client, modified, updateState } = get()
      if (!modified) return
      const resources = [...modified.resources]
      for (const path of paths) {
        const { record } = await client.fileIndex({ path })
        resources.push(record.resource)
      }
      updateState({ modified: { ...modified, resources } })
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
