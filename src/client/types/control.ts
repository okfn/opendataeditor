export type IControl = ICkanControl | IGithubControl | IZenodoControl

export interface ICkanControl {
  type: 'ckan'
  baseurl: string
  dataset: string
  apikey: string
  allowUpdate?: boolean
}

export interface IGithubControl {
  type: 'github'
  user: string
  repo: string
  apikey: string
}

export interface IZenodoControl {
  type: 'zenodo'
  apikey: string
}
