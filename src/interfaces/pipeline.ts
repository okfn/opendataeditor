export interface IPipeline {
  type?: 'resource' | 'package'
  steps?: IStep[]
}

export type IStep =
  | IFieldAddStep
  | IFieldFilterStep
  | IFieldMoveStep
  | IFieldRemoveStep
  | IFieldSplitStep
  | IFieldUnpackStep
  | IFieldUpdateStep

export interface IFieldAddStep {
  code: 'field-add'
  name: string
  value?: any
  formula?: string
}

export interface IFieldFilterStep {
  code: 'field-filter'
  names: string[]
}

export interface IFieldMoveStep {
  code: 'field-move'
  name: string
  position: number
}

export interface IFieldRemoveStep {
  code: 'field-remove'
  names: string[]
}

export interface IFieldSplitStep {
  code: 'field-split'
  name: string
  toNames: string[]
  pattern: string
  preserve?: boolean
}

export interface IFieldUnpackStep {
  code: 'field-unpack'
  name: string
  toNames: string[]
  preserve?: boolean
}

export interface IFieldUpdateStep {
  code: 'field-update'
  name: string
  value?: any
  formula?: string
  newName?: string
}
