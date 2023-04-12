import * as React from 'react'
import * as zustand from 'zustand'
import noop from 'lodash/noop'
import cloneDeep from 'lodash/cloneDeep'
import { assert } from 'ts-essentials'
import { createStore } from 'zustand/vanilla'
import { ITextEditor } from '../../Editors/Text'
import { IView, ITreeItem, IHelpItem } from '../../../interfaces'
import { ViewProps } from './View'
import * as settings from '../../../settings'
import * as helpers from '../../../helpers'
import help from './help.yaml'

const DEFAULT_HELP_ITEM = helpers.readHelpItem(help, 'view')!

export interface State {
  descriptor: IView
  onChange: (view: IView) => void
  fieldTree?: ITreeItem[]
  helpItem: IHelpItem
  updateHelp: (path: string) => void
  updateState: (patch: Partial<State>) => void
  updateDescriptor: (patch: Partial<IView>) => void
  editor: React.RefObject<ITextEditor>
}

export function makeStore(props: ViewProps) {
  return createStore<State>((set, get) => ({
    descriptor: props.view || cloneDeep(settings.INITIAL_VIEW),
    onChange: props.onChange || noop,
    helpItem: DEFAULT_HELP_ITEM,
    view: props.view || { query: '' },
    fieldTree: helpers.createFieldTree(props.fields || []),
    editor: React.createRef<ITextEditor>(),
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

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
