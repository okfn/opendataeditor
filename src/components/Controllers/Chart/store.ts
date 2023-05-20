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
import { IRecord, IColumn, IChart, IResource, IReport } from '../../../interfaces'
import { ChartProps } from './Chart'

export interface State {
  path: string
  client: Client
  isDraft?: boolean
  onSave: () => void
  onSaveAs: (path: string) => void
  onRevert?: () => void
  dialog?: 'saveAs'
  panel?: 'metadata' | 'report' | 'source' | 'editor'
  record?: IRecord
  report?: IReport
  columns?: IColumn[]
  resource?: IResource
  original?: IChart
  modified?: IChart
  rendered?: IChart
  updateState: (patch: Partial<State>) => void
  load: () => Promise<void>
  clear: () => void
  revert: () => void
  save: () => Promise<void>
  saveAs: (path: string) => Promise<void>
  render: () => void
}

export function makeStore(props: ChartProps) {
  return createStore<State>((set, get) => ({
    ...props,
    onSaveAs: props.onSaveAs || noop,
    onSave: props.onSave || noop,
    panel: props.isDraft ? 'editor' : undefined,
    updateState: (patch) => {
      const { render } = get()
      set(patch)
      // TODO: stop using this pattern in favour of proper updateDescriptor/etc methods
      if ('modified' in patch) render()
    },
    load: async () => {
      const { path, client, render } = get()
      const { record } = await client.recordCreate({ path })
      const { report } = await client.reportRead({ name: record.name })
      const resource = cloneDeep(record.resource)
      set({ record, report, resource })
      const { columns } = await client.columnList()
      const { data } = await client.jsonRead({ path: record.path })
      set({ modified: cloneDeep(data), original: data, columns })
      render()
    },
    clear: () => {
      const { updateState } = get()
      updateState({ modified: {} })
    },
    revert: () => {
      const { original, onRevert, updateState } = get()
      updateState({ modified: cloneDeep(original) })
      onRevert && onRevert()
    },
    save: async () => {
      const { record, client, resource, modified, onSave, load } = get()
      if (!record || !resource || !modified) return
      await client.recordWrite({ name: record.name, resource })
      await client.jsonWrite({ path: record.path, data: modified })
      set({ modified: cloneDeep(modified), original: modified })
      onSave()
      load()
    },
    saveAs: async (path) => {
      const { client, modified, onSaveAs } = get()
      // TODO: write resource as well?
      await client.jsonWrite({ path, data: modified })
      onSaveAs(path)
    },
    render: throttle(async () => {
      const { client, modified } = get()
      if (!modified) return
      const { chart } = await client.chartRender({ chart: modified })
      set({ rendered: chart })
    }, 1000),
  }))
}

export const select = createSelector
export const selectors = {
  isUpdated: (state: State) => {
    return (
      state.isDraft ||
      !isEqual(state.original, state.modified) ||
      !isEqual(state.resource, state.record?.resource)
    )
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
