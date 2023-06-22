export type IControl = ICkanControl

export interface ICkanControl {
  type: 'ckan'
  baseurl: string
  dataset: string
  apikey: string
  allowUpdate?: boolean
}
