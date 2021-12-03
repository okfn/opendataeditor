import create from 'zustand'
import noop from 'lodash/noop'
import yaml from 'js-yaml'
import FileSaver from 'file-saver'
import cloneDeep from 'lodash/cloneDeep'
import createContext from 'zustand/context'
import { IResource } from '../../interfaces'
import { ResourceProps } from './Resource'
import * as settings from '../../settings'

// TODO: decide on using onEvent/handleEvent/?

interface ResourceState {
  descriptor: IResource
  checkpoint: IResource
  handleCommit: (descriptor: IResource) => void
  handleRevert: (descriptor: IResource) => void
  // TODO: handle all the state in previewFormat?
  isPreview?: boolean
  // TODO: use deep equality check instead of the flag
  isUpdated?: boolean
  exportFormat: string
  setExportFormat: (format: string) => void
  togglePreview: () => void
  exporter: () => void
  importer: (file: File) => void
  update: (patch: object) => void
  commit: () => void
  revert: () => void
}

export function makeStore(props: ResourceProps) {
  return create<ResourceState>((set, get) => ({
    descriptor: cloneDeep(props.descriptor),
    checkpoint: cloneDeep(props.descriptor),
    handleCommit: props.handleCommit || noop,
    handleRevert: props.handleRevert || noop,
    exportFormat: settings.DEFAULT_EXPORT_FORMAT,
    setExportFormat: (exportFormat) => set({ exportFormat }),
    togglePreview: () => set({ isPreview: !get().isPreview }),
    exporter: () => {
      const { descriptor, exportFormat } = get()
      const isYaml = exportFormat === 'yaml'
      const text = isYaml ? yaml.dump(descriptor) : JSON.stringify(descriptor, null, 2)
      const blob = new Blob([text], { type: `text/${exportFormat};charset=utf-8` })
      FileSaver.saveAs(blob, `${descriptor.name}.resource.${exportFormat}`)
      set({ exportFormat: settings.DEFAULT_EXPORT_FORMAT, isPreview: false })
    },
    importer: async (file) => {
      const text = (await file.text()).trim()
      const isYaml = !text.startsWith('{')
      // TODO: handle errors and validate descriptor
      const descriptor = isYaml ? yaml.load(text) : JSON.parse(text)
      set({ descriptor, isUpdated: true })
    },
    update: (patch) => {
      const { descriptor } = get()
      set({ descriptor: { ...descriptor, ...patch }, isUpdated: true })
    },
    revert: () => {
      const { handleRevert, descriptor, checkpoint } = get()
      set({ descriptor: cloneDeep(checkpoint), isUpdated: false })
      handleRevert(descriptor)
    },
    commit: () => {
      const { handleCommit, descriptor } = get()
      set({ checkpoint: cloneDeep(descriptor), isUpdated: false })
      handleCommit(descriptor)
    },
  }))
}

export const { Provider, useStore } = createContext<ResourceState>()
