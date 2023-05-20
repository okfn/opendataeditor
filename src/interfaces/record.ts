import { IStats } from './stats'
import { IResource } from './resource'

export interface IRecord {
  name: string
  type: string
  path: string
  stats: IStats
  resource: IResource
}
