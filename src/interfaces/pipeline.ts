export interface IPipeline {
  name?: string
  title?: string
  description?: string
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
  type: 'field-add'
  name: string
  value?: any
  formula?: string
}

export interface IFieldFilterStep {
  type: 'field-filter'
  names: string[]
}

export interface IFieldMoveStep {
  type: 'field-move'
  name: string
  position: number
}

export interface IFieldRemoveStep {
  type: 'field-remove'
  names: string[]
}

export interface IFieldSplitStep {
  type: 'field-split'
  name: string
  toNames: string[]
  pattern: string
  preserve?: boolean
}

export interface IFieldUnpackStep {
  type: 'field-unpack'
  name: string
  toNames: string[]
  preserve?: boolean
}

export interface IFieldUpdateStep {
  type: 'field-update'
  name: string
  value?: any
  formula?: string
  newName?: string
}
