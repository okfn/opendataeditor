import * as React from 'react'
import * as zustand from 'zustand'
import noop from 'lodash/noop'
import cloneDeep from 'lodash/cloneDeep'
import { assert } from 'ts-essentials'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { ITextEditor } from '../../Parts/TextEditor'
import { ViewProps } from './index'
import * as settings from '../../../settings'
import * as helpers from '../../../helpers'
import help from './help.yaml'
import * as types from '../../../types'

const DEFAULT_HELP_ITEM = helpers.readHelpItem(help, 'view')!

export interface State {
  descriptor: types.IView
  onChange: (view: types.IView) => void
  columns?: types.IColumn[]
  helpItem: types.IHelpItem
  updateHelp: (path: string) => void
  updateState: (patch: Partial<State>) => void
  updateDescriptor: (patch: Partial<types.IView>) => void
  editorRef: React.RefObject<ITextEditor>
  searchTerm?: string
}

export function makeStore(props: ViewProps, editorRef: React.RefObject<ITextEditor>) {
  return createStore<State>((set, get) => ({
    columns: props.columns,
    descriptor: props.view || cloneDeep(settings.INITIAL_VIEW),
    onChange: props.onChange || noop,
    helpItem: DEFAULT_HELP_ITEM,
    view: props.view || { query: '' },
    editorRef,
    updateState: (patch) => {
      set({ ...patch })
    },
    updateHelp: (path) => {
      const helpItem = helpers.readHelpItem(help, path) || DEFAULT_HELP_ITEM
      set({ helpItem })
    },
    updateDescriptor: (patch) => {
      const { descriptor, onChange } = get()
      Object.assign(descriptor, patch)
      onChange(descriptor)
      set({ descriptor })
    },
  }))
}

export const select = createSelector
export const selectors = {
  foundColumns: (state: State) => {
    const columns: types.IColumn[] = []
    const search = state.searchTerm?.toLowerCase()
    for (const column of state.columns || []) {
      if (search) {
        const text = column.name + column.type + column.tableName + column.tablePath
        if (!text.includes(search)) continue
      }
      columns.push(column)
    }
    return columns
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
