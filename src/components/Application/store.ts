import create from 'zustand'
import { assert } from 'ts-essentials'
import { client } from '../../client'
import { IReport, ITable } from '../../interfaces'
import { IQuery, IInquiry, IDetector, IResource, IPipeline } from '../../interfaces'

export interface IState {
  contentType: string
  token?: string
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
  setContentType: (contentType: string) => void
  toggleMetadataOpen: () => void
  toggleSourceView: () => void
  toggleReportView: () => void
  toggleErrorsView: () => void
  uploadFile: (file: File) => void
  updateDetector: (patch: Partial<IDetector>) => void
  updateResource: (patch: Partial<IResource>) => void
  updateQuery: (patch: Partial<IQuery>) => void
  updateInquiry: (patch: Partial<IInquiry>) => void
  updatePipeline: (patch: Partial<IPipeline>) => void
  updateTable: (rowPosition: number, fieldName: string, value: any) => void
}

export const initialState = {
  isHelpView: true,
  contentType: 'help',
  paths: [],
  // TODO: move to settings or server-side
  detector: { bufferSize: 10000, sampleSize: 100 },
}

export const useStore = create<IState & ILogic>((set, get) => ({
  ...initialState,

  // Page

  setContentType: (contentType) => set({ contentType }),
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
    const { detector } = get()
    const { token } = await client.sessionCreate()
    const { path } = await client.sessionCreateFile({ token, file })
    const { paths } = await client.sessionListFiles({ token })
    const { resource } = await client.resourceDescribe({ path, detector })
    const { table } = await client.resourceExtract({ resource })
    const { report } = await client.resourceValidate({ resource })
    set({ contentType: 'data', token, path, paths, resource, table, report })
  },

  // Metadata

  updateDetector: (patch) => {
    const { detector } = get()
    if (detector) set({ detector: { ...detector, ...patch } })
  },
  updateResource: async (patch) => {
    const { file, resource, query, inquiry } = get()
    assert(file)
    assert(resource)
    assert(query)
    assert(inquiry)
    const newResource = { ...resource, ...patch }
    const { table } = await client.extract(file, newResource, query)
    const { report } = await client.validate(file, newResource, inquiry)
    set({ resource: newResource, table, report })
  },
  updateQuery: async (patch) => {
    const { file, resource, query } = get()
    assert(file)
    assert(resource)
    assert(query)
    const newQuery = { ...query, ...patch }
    const { table } = await client.extract(file, resource, newQuery)
    set({ query: newQuery, table })
  },
  updateInquiry: async (patch) => {
    const { file, resource, inquiry } = get()
    assert(file)
    assert(resource)
    assert(inquiry)
    const newInquiry = { ...inquiry, ...patch }
    const { report } = await client.validate(file, resource, newInquiry)
    set({ inquiry: newInquiry, report })
  },
  updatePipeline: async (patch) => {
    const { file, resource, pipeline } = get()
    assert(file)
    assert(resource)
    assert(pipeline)
    const newPipeline = { ...pipeline, ...patch }
    const { status, table } = await client.transform(file, resource, newPipeline)
    set({ pipeline: newPipeline, status, table })
  },
  // TODO: implement properly
  updateTable: (rowPosition, fieldName, value) => {
    const { table } = get()
    assert(table)
    table.rows = table.rows.map((row, index) => {
      if (rowPosition === index + 2) row[fieldName] = value
      return row
    })
    set({ table: { ...table } })
  },
}))
