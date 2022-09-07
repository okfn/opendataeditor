import create from 'zustand'
import noop from 'lodash/noop'
import yaml from 'js-yaml'
import FileSaver from 'file-saver'
import cloneDeep from 'lodash/cloneDeep'
import createContext from 'zustand/context'
import { IPackage } from '../../interfaces'
import { PackageProps } from './Package'
import * as settings from '../../settings'

const INITIAL_PACKAGE: IPackage = { resources: [] }

interface PackageState {
  descriptor: IPackage
  checkpoint: IPackage
  onCommit: (descriptor: IPackage) => void
  onRevert: (descriptor: IPackage) => void
  isPreview?: boolean
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

export function makeStore(props: PackageProps) {
  return create<PackageState>((set, get) => ({
    descriptor: cloneDeep(props.descriptor || INITIAL_PACKAGE),
    checkpoint: cloneDeep(props.descriptor || INITIAL_PACKAGE),
    onCommit: props.onCommit || noop,
    onRevert: props.onRevert || noop,
    exportFormat: settings.DEFAULT_EXPORT_FORMAT,
    setExportFormat: (exportFormat) => set({ exportFormat }),
    togglePreview: () => set({ isPreview: !get().isPreview }),
    exporter: () => {
      const { descriptor, exportFormat } = get()
      const isYaml = exportFormat === 'yaml'
      const text = isYaml ? yaml.dump(descriptor) : JSON.stringify(descriptor, null, 2)
      const blob = new Blob([text], { type: `text/${exportFormat};charset=utf-8` })
      FileSaver.saveAs(blob, `datapackage.${exportFormat}`)
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
      const { onRevert, descriptor, checkpoint } = get()
      set({ descriptor: cloneDeep(checkpoint), isUpdated: false })
      onRevert(descriptor)
    },
    commit: () => {
      const { onCommit, descriptor } = get()
      set({ checkpoint: cloneDeep(descriptor), isUpdated: false })
      onCommit(descriptor)
    },
  }))
}

export const { Provider, useStore } = createContext<PackageState>()
