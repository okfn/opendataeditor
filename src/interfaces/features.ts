export interface IFeatures {
  layout: ILayout
  dialect: IDialect
  control: IControl
}

export interface ILayout {
  header?: boolean
  headerRows?: number[]
}

export interface IDialect {
  code: string
  delimiter?: string
}

export interface IControl {
  code: string
}
