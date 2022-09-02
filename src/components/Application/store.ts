import create from 'zustand'
import { assert } from 'ts-essentials'
import { client } from '../../client'
import { ISession, IReport, ITable } from '../../interfaces'
import { IDetector, IResource } from '../../interfaces'

export interface IState {
  session?: ISession
  path?: string
  paths: string[]
  detector: IDetector
  resource?: IResource
  table?: ITable
  report?: IReport
  isMetadataOpen?: boolean
  isSourceView?: boolean
  isReportView?: boolean
  isErrorsView?: boolean
}

export interface ILogic {
  toggleMetadataOpen: () => void
  toggleSourceView: () => void
  toggleReportView: () => void
  toggleErrorsView: () => void
  uploadFile: (file: File) => void
  updateDetector: (patch: Partial<IDetector>) => void
  updateResource: (patch: Partial<IResource>) => void
  updateTable: (rowNumber: number, fieldName: string, value: any) => void
}

export const initialState = {
  paths: [],
  // TODO: move to settings or server-side
  detector: { bufferSize: 10000, sampleSize: 100 },
}

export const useStore = create<IState & ILogic>((set, get) => ({
  ...initialState,

  // Page

  toggleMetadataOpen: () => set({ isMetadataOpen: !get().isMetadataOpen }),
  toggleSourceView: () => set({ isSourceView: !get().isSourceView, isReportView: false }),
  toggleReportView: () => set({ isReportView: !get().isReportView, isSourceView: false }),
  toggleErrorsView: () =>
    set({ isErrorsView: !get().isErrorsView, isSourceView: false, isReportView: false }),

  // File

  uploadFile: async (file) => {
    const isCsv = file.name.endsWith('.csv')
    const isExcel = file.name.endsWith('.xlsx')
    if (!(isCsv || isExcel) || file.size > 10000000) {
      // TODO: clean file input
      alert('Currently only CSV and Excel files under 10Mb are supported')
      return
    }
    const { detector, updateResource } = get()
    const { session } = await client.projectCreate()
    const { path } = await client.projectCreateFile({ session, file })
    const { paths } = await client.projectListFiles({ session })
    const { resource } = await client.resourceDescribe({ path, detector })
    set({ session, path, paths })
    updateResource(resource)
  },

  // Metadata

  updateDetector: (patch) => {
    const detector = { ...get().detector, ...patch }
    set({ detector })
  },
  updateResource: async (patch) => {
    const { session } = get()
    const resource = { ...get().resource, ...patch } as IResource
    const { table } = await client.resourceExtract({ session, resource })
    const { report } = await client.resourceValidate({ session, resource })
    set({ resource, table, report })
  },
  // TODO: implement properly
  updateTable: (rowNumber, fieldName, value) => {
    const { table } = get()
    assert(table)
    table.rows = table.rows.map((row, index) => {
      if (rowNumber === index + 2) row[fieldName] = value
      return row
    })
    set({ table: { ...table } })
  },
}))
