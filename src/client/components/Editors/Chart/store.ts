import * as React from 'react'
import * as zustand from 'zustand'
import { assert } from 'ts-essentials'
import noop from 'lodash/noop'
import uniq from 'lodash/uniq'
import { createStore } from 'zustand/vanilla'
import { createSelector } from 'reselect'
import { ChartProps } from './index'
import * as helpers from '../../../helpers'
import * as settings from './settings'
import * as types from '../../../types'
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
  columns: types.IColumn[]
  descriptor: Partial<types.IChart>
  customFields: string[]
  layerItems: types.IMenuItem[]
  layers: string[]
  layerIndex: number
  section: string
  externalMenu?: { section: string }
  onChange: (chart: object) => void
  helpItem: types.IHelpItem
  updateState: (patch: Partial<State>) => void
  updateHelp: (path: string) => void
  updateDescriptor: (patch: Partial<types.IChart>) => void
  updateCustomFields: (field: string) => void

  // Layer
  addLayer: () => void
  removeLayer: (index: number) => void

  // Channels

  channelStates: IChannelState[]
  updateChannelState: (patch: Partial<IChannelState>) => void
  updateChannelType: (type: string) => void
  updateLayerChannel: (patch: any) => void
  // TODO: add proper type
  updateChannel: (patch: any) => void
  removeChannel: (type: string) => void
  addChannel: () => void

  // Transform

  transformStates: ISectionState[]
  updateTransformState: (patch: Partial<ISectionState>) => void
  updateTransformType: (type: string) => void
  updateTransform: (patch: Partial<types.ITransform>) => void
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
    columns: props.columns || [],
    customFields: [],
    descriptor: props.chart || {},
    layers: ['general'],
    layerItems: [
      { section: 'general', name: 'General' },
      { section: 'general/chart', name: 'Chart' },
      { section: 'general/channel', name: 'Channel' },
      { section: 'general/transform', name: 'Transform' },
    ],
    layerIndex: 0,
    section: 'channel',
    onChange: props.onChange || noop,
    helpItem: DEFAULT_HELP_ITEM,
    updateHelp: (path) => {
      const helpItem = helpers.readHelpItem(help, path) || DEFAULT_HELP_ITEM
      set({ helpItem })
    },
    updateLayerChannel: (patch) => {
      const { descriptor, updateState } = get()
      const channel = selectors.channel(get())
      Object.assign(channel, patch)
      updateState({ descriptor })
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

    // Layers
    addLayer: () => {
      const { layerItems, layerIndex, layers, updateDescriptor, descriptor } = get()
      const newIndex = layerIndex + 1
      const layer = descriptor.layer || []
      const layerName = `Layer${newIndex}`
      const prefix = layerName.toLowerCase()
      const newLayer = [
        { section: prefix, name: layerName },
        { section: `${prefix}/chart`, name: 'Chart' },
        { section: `${prefix}/channel`, name: 'Channel' },
        { section: `${prefix}/transform`, name: 'Transform' },
      ]
      if (!layer[layerIndex]) {
        layer[layerIndex] = {}
      }
      layers.push(prefix)
      updateDescriptor({ layer })
      set({ layerItems: [...layerItems, ...newLayer], layerIndex: newIndex })
    },
    removeLayer: (index) => {
      const { channelStates, descriptor, layerItems, layerIndex, layers, updateState } =
        get()
      const updatedChannelStates = channelStates.filter(
        (_, stateIndex) => stateIndex !== index
      )
      descriptor.layer = descriptor?.layer?.filter(
        (_, layerIndex) => layerIndex !== index - 1
      )
      layerItems.splice(index, 3)
      layers.splice(index, 1)
      set({ channelStates: updatedChannelStates, layerItems, layerIndex: layerIndex - 1 })
      updateState({ descriptor })
    },

    // Channels

    channelStates: [],
    updateChannelState: (patch) => {
      const { channelStates, layerIndex } = get()
      channelStates[layerIndex] = { ...channelStates[layerIndex], ...patch }
      set({ channelStates: { ...channelStates, ...patch } })
    },
    updateChannelType: (type) => {
      const { descriptor, layerIndex, channelStates, updateState, updateChannelState } =
        get()
      const oldType = channelStates[layerIndex].type!
      const channel = selectors.channel(get())

      // Layer
      if (layerIndex > 0) {
        const layer = layerIndex - 1
        if (!descriptor.layer) descriptor.layer = []
        const currentLayer = descriptor.layer[layer]
        currentLayer.encoding = { ...currentLayer.encoding, [type]: channel }
        descriptor.layer[layer] = currentLayer
        updateChannelState({ type })
        delete descriptor.layer[layer].encoding![oldType]
        updateState({ descriptor })
        return
      }

      descriptor.encoding![type] = channel
      updateChannelState({ type })
      delete descriptor.encoding![oldType]
      updateState({ descriptor })
    },
    updateChannel: (patch) => {
      const { columns, descriptor, updateState } = get()
      const channel = selectors.channel(get())
      if ('field' in patch) {
        for (const item of columns || []) {
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
      const { descriptor, updateState, layerIndex } = get()

      // Layer
      if (layerIndex > 0) {
        const layer = layerIndex - 1
        descriptor.layer![layer].encoding = descriptor.layer![layer].encoding || {}
        for (const type of settings.CHANNEL_TYPES) {
          if (!descriptor.layer![layer].encoding?.[type]) {
            const encoding = descriptor.layer![layer].encoding
            descriptor.layer![layer].encoding = { ...encoding, [type]: {} }
            break
          }
        }
        updateState({ descriptor })
        return
      }

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

    transformStates: [],
    updateTransformState: (patch) => {
      const { transformStates, layerIndex } = get()
      transformStates[layerIndex] = { ...transformStates[layerIndex], ...patch }
      set({ transformStates: { ...transformStates, ...patch } })
    },
    updateTransformType: (type) => {
      const {
        descriptor,
        layerIndex,
        transformStates,
        updateState,
        updateTransformState,
      } = get()
      const index = transformStates[layerIndex].index!
      const title = descriptor.transform![index].title
      descriptor.transform![index] = { title }
      updateTransformState({ type })
      updateState({ descriptor })
    },
    updateTransform: (patch) => {
      const { descriptor, layerIndex, transformStates, updateDescriptor } = get()
      const index = transformStates[layerIndex].index!
      const transform = selectors.transform(get())
      const transforms = descriptor.transform!
      transforms[index] = { ...transform, ...patch }
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
      const { descriptor, layerIndex, transformStates, updateState, updateFilterState } =
        get()
      const index = transformStates[layerIndex].index!
      descriptor.transform![index] = {}
      updateFilterState({ type })
      updateState({ descriptor })
    },
  }))
}

export const select = createSelector
export const selectors = {
  tablePaths: (state: State) => {
    const paths = uniq(state.columns.map((field) => field.tablePath))
    if (state.descriptor.data?.values) paths.unshift('(inline)')
    return paths
  },
  fieldNames: (state: State) => {
    const names = state.columns
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
    const type = state.channelStates[state.layerIndex]?.type!
    let channel
    if (state.layerIndex > 0 && state.descriptor.layer) {
      channel = state.descriptor.layer[state.layerIndex - 1]?.encoding![type]!
    } else {
      channel = state.descriptor.encoding![type]!
    }
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
  channelActiveInputValue: (activeInput: string) => (state: State) => {
    const channel = selectors.channel(state) as { [key: string]: any }
    return channel[activeInput]
  },
  channelItems: (state: State) => {
    const items = []
    const query = state.channelStates[state.layerIndex]?.query
    let encoding = state.descriptor.encoding
    if (state.layerIndex > 0) {
      encoding = state.descriptor.layer?.[state.layerIndex - 1]?.encoding || {}
    }
    for (const [type, channel] of Object.entries(encoding || {})) {
      if (query && !type.toLowerCase().includes(query.toLowerCase())) continue
      items.push({ type, channel })
    }
    return items
  },

  // Transform

  transform: (state: State) => {
    const index = state.transformStates[state.layerIndex].index!
    const transforms = state.descriptor.transform!
    const transform = transforms[index]!
    return transform
  },
  transformItems: (state: State) => {
    const items = []
    const query = state.transformStates[state.layerIndex]?.query
    for (const [index, transform] of (state.descriptor.transform || []).entries()) {
      if (query && !transform[query.toLowerCase() as keyof types.ITransform]) {
        continue
      }
      items.push({ index, transform })
    }
    return items
  },

  // Filter

  filterPredicate: (state: State) => {
    const allKeys = ['timeUnit', 'field']
    const transform = selectors.transform(state) as types.IFilter
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
