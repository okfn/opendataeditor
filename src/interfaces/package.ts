import { IResource } from './resource'
import { IContributor } from './contributor'

export interface IPackage {
  name?: string
  title?: string
  description?: string
  homepage?: string
  version?: string
  created?: string
  imageUrl?: string
  resources: IResource[]
  contributors?: IContributor[]
}
