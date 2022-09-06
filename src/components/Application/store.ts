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
  ensureProject: () => Promise<void>
  loadEverything: () => Promise<void>
  selectPath: (path?: string) => void
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

  toggleMetadataOpen: () => set({ isMetadataOpen: !get().isMetadataOpen }),
  ensureProject: async () => {
    if (get().session) return
    const { session } = await client.projectCreate()
    set({ session })
  },
  selectPath: (path?: string) => {
    console.log(path)
    const { loadEverything } = get()
    set({ path })
    loadEverything().catch(console.error)
  },
  loadEverything: async () => {
    const { session, path } = get()
    if (!path) return
    const { resource } = await client.resourceDescribe({ session, path })
    const { table } = await client.resourceExtract({ session, resource })
    const { report } = await client.resourceValidate({ session, resource })
    set({ resource, table, report })
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
