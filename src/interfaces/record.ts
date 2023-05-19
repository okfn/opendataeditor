import { IResource } from './resource'

export interface IRecord {
  id: string
  type: string
  path: string
  resource: IResource
}
