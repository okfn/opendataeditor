import { IResource } from './resource'

export interface IRecord {
  name: string
  type: string
  path: string
  resource: IResource
}
