import * as React from 'react'
import * as zustand from 'zustand'
import { assert } from 'ts-essentials'
import noop from 'lodash/noop'
import uniq from 'lodash/uniq'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { IHelpItem, IFieldItem, IChart } from '../../../interfaces'
import { ChartProps } from './Chart'
import * as helpers from '../../../helpers'
import * as settings from './settings'
import help from './help.yaml'

const DEFAULT_HELP_ITEM = helpers.readHelpItem(help, 'chart')!

interface IChannelState {
  query?: string
  type?: string
  isGrid?: boolean
  isExtras?: boolean
}

interface State {
  fields: IFieldItem[]
  descriptor: Partial<IChart>
  onChange: (chart: object) => void
  helpItem: IHelpItem
  updateState: (patch: Partial<State>) => void
  updateHelp: (path: string) => void
  updateDescriptor: (patch: Partial<IChart>) => void

  // Channels

  channelState: IChannelState
  updateChannelState: (patch: Partial<IChannelState>) => void
  updateChannelType: (type: string) => void
  // TODO: fix
  updateChannel: (patch: any) => void
  removeChannel: (type: string) => void
  addChannel: () => void
}

export function makeStore(props: ChartProps) {
  return createStore<State>((set, get) => ({
    options: {},
    fields: props.fields || [],
    descriptor: props.chart || {},
    onChange: props.onChange || noop,
    helpItem: DEFAULT_HELP_ITEM,
    updateHelp: (path) => {
      const helpItem = helpers.readHelpItem(help, path) || DEFAULT_HELP_ITEM
      set({ helpItem })
    },
    updateState: (patch) => {
      const { onChange } = get()
      if (patch.descriptor) onChange(patch.descriptor)
      set({ ...patch })
    },
    updateDescriptor: (patch) => {
      const { descriptor, onChange } = get()
      Object.assign(descriptor, patch)
      onChange(descriptor)
      set({ descriptor })
    },

    // Channels

    channelState: {},
    updateChannelState: (patch) => {
      const { channelState } = get()
      set({ channelState: { ...channelState, ...patch } })
    },
    updateChannelType: (type) => {
      const { descriptor, channelState, updateState, updateChannelState } = get()
      const oldType = channelState.type!
      const channel = selectors.channel(get())
      descriptor.encoding![type] = channel
      updateChannelState({ type })
      delete descriptor.encoding![oldType]
      updateState({ descriptor })
    },
    updateChannel: (patch) => {
      const { fields, descriptor, updateState } = get()
      const channel = selectors.channel(get())
      if ('field' in patch) {
        for (const item of fields || []) {
          if (patch.field === item.name) {
            switch (item.type) {
              case 'number':
              case 'integer':
                patch.type = 'quantitative'
                break
              case 'date':
              case 'time':
              case 'datetime':
                patch.type = 'temporal'
                break
              default:
                patch.type = 'nominal'
            }
          }
        }
      }
      Object.assign(channel, patch)
      updateState({ descriptor })
    },
    removeChannel: (type) => {
      const { descriptor, updateState, updateChannelState } = get()
      delete descriptor.encoding![type]
      updateChannelState({ type: undefined, isExtras: false })
      updateState({ descriptor })
    },
    // TODO: scroll to newly created channel
    addChannel: () => {
      const { descriptor, updateState } = get()
      descriptor.encoding = descriptor.encoding || {}
      for (const type of settings.CHANNEL_TYPES) {
        if (!descriptor.encoding[type]) {
          descriptor.encoding[type] = {}
          break
        }
      }
      updateState({ descriptor })
    },
  }))
}

export const select = createSelector
export const selectors = {
  tablePaths: (state: State) => {
    const paths = uniq(state.fields.map((field) => field.tablePath))
    if (state.descriptor.data?.values) paths.unshift('(inline)')
    return paths
  },
  fieldNames: (state: State) => {
    const names = state.fields
      .filter((item) => item.tablePath === state.descriptor.data?.url)
      .map((item) => item.name)
    if (state.descriptor.data?.values) {
      const item = state.descriptor.data.values[0] || {}
      names.push(...Object.keys(item))
    }
    return names
  },

  // Channels

  channel: (state: State) => {
    const type = state.channelState.type!
    const channel = state.descriptor.encoding![type]!
    return channel
  },
  channelItems: (state: State) => {
    const items = []
    const query = state.channelState.query
    for (const [type, channel] of Object.entries(state.descriptor.encoding || {})) {
      if (query && !type.toLowerCase().includes(query.toLowerCase())) continue
      items.push({ type, channel })
    }
    return items
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
