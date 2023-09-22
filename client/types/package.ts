import { IResource } from './resource'
import { IContributor } from './contributor'
import { ILicense } from './license'
import { ISource } from './source'

export interface IPackage {
  name?: string
  title?: string
  description?: string
  licenses?: ILicense[]
  homepage?: string
  version?: string
  created?: string
  image?: string
  resources: IResource[]
  contributors?: IContributor[]
  keywords?: string[]
  sources?: ISource[]
}
