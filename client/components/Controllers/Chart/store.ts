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
import { ChartProps } from './index'
import * as types from '../../../types'

export interface State {
  path: string
  client: Client
  onSave: () => void
  onSaveAs: (path: string) => void
  dialog?: 'publish' | 'saveAs' | 'chat' | 'leave'
  panel?: 'editor' | 'metadata' | 'report' | 'source'
  record?: types.IRecord
  report?: types.IReport
  measure?: types.IMeasure
  columns?: types.IColumn[]
  resource?: types.IResource
  original?: types.IChart
  modified?: types.IChart
  rendered?: types.IChart
  updateState: (patch: Partial<State>) => void

  // General

  load: () => Promise<void>
  edit: (prompt: string) => Promise<void>
  clear: () => void
  saveAs: (toPath: string) => Promise<void>
  publish: (control: types.IControl) => Promise<string | undefined>
  revert: () => void
  save: () => Promise<void>
  render: () => void
  onClickAway: () => void
}

export function makeStore(props: ChartProps) {
  return createStore<State>((set, get) => ({
    ...props,
    panel: 'editor',
    onSaveAs: props.onSaveAs || noop,
    onSave: props.onSave || noop,
    updateState: (patch) => {
      const { render } = get()
      set(patch)
      // TODO: stop using this pattern in favour of proper updateDescriptor/etc methods
      if ('modified' in patch) render()
    },
    load: async () => {
      const { path, client, render } = get()
      const { record, report, measure } = await client.fileIndex({ path })
      const { columns } = await client.columnList()
      const { data } = await client.jsonRead({ path: record.path })
      set({
        record,
        report,
        measure,
        resource: cloneDeep(record.resource),
        modified: cloneDeep(data),
        original: data,
        columns,
      })
      render()
    },
    edit: async (prompt) => {
      const { path, client, modified, updateState } = get()
      if (!modified) return
      const { chart } = await client.chartEdit({ path, chart: modified, prompt })
      updateState({ modified: chart })
    },
    clear: () => {
      const { updateState } = get()
      updateState({ modified: {} })
    },
    saveAs: async (toPath) => {
      const { path, client, modified, resource, onSaveAs } = get()
      await client.jsonPatch({ path, toPath, data: modified, resource })
      onSaveAs(toPath)
    },
    publish: async (control) => {
      const { record, client } = get()
      const { url } = await client.filePublish({ path: record!.path, control })
      return url
    },
    revert: () => {
      const { original, updateState } = get()
      updateState({ modified: cloneDeep(original) })
    },
    save: async () => {
      const { path, client, modified, resource, onSave, load } = get()
      await client.jsonPatch({
        path,
        data: selectors.isDataUpdated(get()) ? modified : undefined,
        resource: selectors.isMetadataUpdated(get()) ? resource : undefined,
      })
      onSave()
      load()
    },
    render: throttle(async () => {
      const { path, client, modified } = get()
      if (!modified) return
      const { chart } = await client.chartRender({ path, chart: modified })
      set({ rendered: chart })
    }, 1000),
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
    return !isEqual(state.original, state.modified)
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
