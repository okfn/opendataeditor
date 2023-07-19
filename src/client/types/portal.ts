export interface IPortal {
  type: 'ckan' | 'github' | 'zenodo'
  ckan?: Partial<ICkanControl>
  github?: Partial<IGithubControl>
  zenodo?: Partial<IZenodoControl>
}

export type IControl = ICkanControl | IGithubControl | IZenodoControl

export interface ICkanControl {
  type: 'ckan'
  baseurl: string
  dataset: string
  apikey: string
  allowUpdate: boolean
}

export interface IGithubControl {
  type: 'github'
  user: string
  repo: string
  email?: string
  apikey: string
}

export interface IZenodoControl {
  type: 'zenodo'
  title: string
  description: string
  author: string
  apikey: string
}
