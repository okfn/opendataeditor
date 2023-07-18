export interface IPortal {
  type: 'ckan' | 'github' | 'zenodo'
  ckan?: Partial<ICkanConfig>
  github?: Partial<IGithubConfig>
  zenodo?: Partial<IZenodoConfig>
}

export interface ICkanConfig {
  baseurl?: string
  dataset?: string
  apikey?: string
  allowUpdate?: boolean
}

export interface IGithubConfig {
  user?: string
  repo?: string
  apikey?: string
}

export interface IZenodoConfig {
  apikey?: string
}
