import * as React from 'react'
import * as zustand from 'zustand'
import noop from 'lodash/noop'
import cloneDeep from 'lodash/cloneDeep'
import { assert } from 'ts-essentials'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { ITextEditor } from '../../Parts/TextEditor'
import { IView, IFieldItem, IHelpItem } from '../../../interfaces'
import { ViewProps } from './index'
import * as settings from '../../../settings'
import * as helpers from '../../../helpers'
import help from './help.yaml'

const DEFAULT_HELP_ITEM = helpers.readHelpItem(help, 'view')!

export interface State {
  descriptor: IView
  onChange: (view: IView) => void
  fields?: IFieldItem[]
  helpItem: IHelpItem
  updateHelp: (path: string) => void
  updateState: (patch: Partial<State>) => void
  updateDescriptor: (patch: Partial<IView>) => void
  editorRef: React.RefObject<ITextEditor>
  searchTerm?: string
}

export function makeStore(props: ViewProps, editorRef: React.RefObject<ITextEditor>) {
  return createStore<State>((set, get) => ({
    fields: props.fields,
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
  fieldTree: (state: State) => {
    const fields: IFieldItem[] = []
    const search = state.searchTerm?.toLowerCase()
    for (const field of state.fields || []) {
      if (search) {
        const text = field.name + field.type + field.tableName + field.tablePath
        if (!text.includes(search)) continue
      }
      fields.push(field)
    }
    return helpers.createFieldTree(fields)
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
