import { IResource } from './resource'

export interface IRecord {
  name: string
  type: string
  path: string
  dataUpdatedAt?: number
  resource: IResource
}
