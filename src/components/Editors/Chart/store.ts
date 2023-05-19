import * as React from 'react'
import * as zustand from 'zustand'
import { assert } from 'ts-essentials'
import noop from 'lodash/noop'
import uniq from 'lodash/uniq'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { IHelpItem, IFieldItem, IChart, ITransform, IFilter } from '../../../interfaces'
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
  activeInput?: string
}

interface ISectionState {
  query?: string
  index?: number
  type?: string
  isGrid?: boolean
  isExtras?: boolean
}

interface State {
  fields: IFieldItem[]
  customFields: string[]
  descriptor: Partial<IChart>
  layer: number
  onChange: (chart: object) => void
  helpItem: IHelpItem
  updateState: (patch: Partial<State>) => void
  updateHelp: (path: string) => void
  updateDescriptor: (patch: Partial<IChart>) => void
  updateCustomFields: (field: string) => void

  // Channels

  channelStates: IChannelState[]
  updateChannelState: (patch: Partial<IChannelState>) => void
  updateChannelType: (type: string) => void
  // TODO: add proper type
  updateChannel: (patch: any) => void
  removeChannel: (type: string) => void
  addChannel: () => void

  // Transform

  transformState: ISectionState
  updateTransformState: (patch: Partial<ISectionState>) => void
  updateTransformType: (type: string) => void
  updateTransform: (patch: Partial<ITransform>) => void
  removeTransform: (index: number) => void
  addTransform: () => void

  // Transform

  filterState: Partial<ISectionState>
  updateFilterState: (patch: Partial<ISectionState>) => void
  updateFilterType: (type: string) => void
}

export function makeStore(props: ChartProps) {
  return createStore<State>((set, get) => ({
    options: {},
    fields: props.fields || [],
    customFields: [],
    descriptor: props.chart || {},
    layer: 0,
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
    updateCustomFields: (field) => {
      const { customFields } = get()
      customFields.push(field)
      set({ customFields })
    },

    // Channels

    channelStates: [],
    updateChannelState: (patch) => {
      const { channelStates, layer } = get()
      channelStates[layer] = { ...channelStates[layer], ...patch }
      set({ channelStates: { ...channelStates, ...patch } })
    },
    updateChannelType: (type) => {
      const { descriptor, layer, channelStates, updateState, updateChannelState } = get()
      const oldType = channelStates[layer].type!
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
      if ('value' in patch) {
        patch.field = undefined
        // TODO: support other types for value
        patch.type = 'quantitative'
      }
      if ('customFieldType' in patch) {
        patch.type = patch.customFieldType
        delete patch.customFieldType
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

    // Transform

    transformState: {},
    updateTransformState: (patch) => {
      const { transformState } = get()
      set({ transformState: { ...transformState, ...patch } })
    },
    updateTransformType: (type) => {
      const { descriptor, transformState, updateState, updateTransformState } = get()
      const index = transformState.index!
      const title = descriptor.transform![index].title
      descriptor.transform![index] = { title }
      updateTransformState({ type })
      updateState({ descriptor })
    },
    updateTransform: (patch) => {
      const { descriptor, transformState, updateDescriptor } = get()
      const index = transformState.index!
      const transform = selectors.transform(get())
      const transforms = descriptor.transform!
      transforms[index] = { ...transform, ...patch }
      console.log('descriptor', descriptor)
      updateDescriptor({ transform: transforms })
    },
    removeTransform: (index) => {
      const { descriptor, updateDescriptor, updateTransformState } = get()
      const transforms = [...(descriptor.transform || [])]
      transforms.splice(index, 1)
      updateTransformState({ index: undefined, isExtras: false })
      updateDescriptor({ transform: transforms })
    },
    // TODO: scroll to newly created transform
    addTransform: () => {
      const { descriptor, updateDescriptor } = get()
      const transforms = [...(descriptor.transform || [])]
      transforms.push({
        title: helpers.generateTitle(transforms, 'transform'),
      })
      updateDescriptor({ transform: transforms })
    },

    // Filter
    filterState: {},
    updateFilterState: (patch) => {
      const { filterState } = get()
      set({ filterState: { ...filterState, ...patch } })
    },
    updateFilterType: (type) => {
      const { descriptor, transformState, updateState, updateFilterState } = get()
      const index = transformState.index!
      descriptor.transform![index] = {}
      updateFilterState({ type })
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
    const type = state.channelStates[state.layer].type!
    const channel = state.descriptor.encoding![type]!
    return channel
  },
  // TODO: remove! somehow it doesn't rerender using channel and select
  channelAggregate: (state: State) => {
    const channel = selectors.channel(state)
    return channel.aggregate
  },
  // TODO: remove! somehow it doesn't rerender using channel and select
  channelValue: (state: State) => {
    const channel = selectors.channel(state)
    return channel.value
  },
  // TODO: remove! somehow it doesn't rerender using channel and select
  channelActiveInput: (state: State) => {
    const activeInput = state.channelStates[state.layer].activeInput!
    const channel = selectors.channel(state) as { [key: string]: any }
    return channel[activeInput]
  },
  // TODO: remove! somehow it doesn't rerender using channel and select
  channelActiveInputValue: (activeInput: string) => (state: State) => {
    const channel = selectors.channel(state) as { [key: string]: any }
    return channel[activeInput]
  },
  channelItems: (state: State) => {
    const items = []
    const query = state.channelStates[state.layer]?.query
    for (const [type, channel] of Object.entries(state.descriptor.encoding || {})) {
      if (query && !type.toLowerCase().includes(query.toLowerCase())) continue
      items.push({ type, channel })
    }
    return items
  },

  // Transform

  transform: (state: State) => {
    const index = state.transformState.index!
    const transforms = state.descriptor.transform!
    const transform = transforms[index]!
    return transform
  },
  transformItems: (state: State) => {
    const items = []
    const query = state.transformState.query
    for (const [index, transform] of (state.descriptor.transform || []).entries()) {
      if (query && !transform[query.toLowerCase() as keyof ITransform]) {
        continue
      }
      items.push({ index, transform })
    }
    return items
  },

  // Filter

  filterPredicate: (state: State) => {
    const allKeys = ['timeUnit', 'field']
    const transform = selectors.transform(state) as IFilter
    if (!transform.filter) return ''
    const predicate = Object.keys(transform?.filter).filter(
      (x) => allKeys.indexOf(x) === -1
    )[0]
    return predicate || ''
  },
}

export function useStore<R>(selector: (state: State) => R): R {
  const store = React.useContext(StoreContext)
  assert(store, 'store provider is required')
  return zustand.useStore(store, selector)
}

const StoreContext = React.createContext<zustand.StoreApi<State> | null>(null)
export const StoreProvider = StoreContext.Provider
