export interface IPipeline {
  type?: 'resource' | 'package'
  steps?: IStep[]
}

export type IStep = IFieldAddStep | IFieldRemoveStep | IFieldUpdateStep

export interface IFieldAddStep {
  code: 'field-add'
  name: string
  value?: any
  formula?: string
}

export interface IFieldRemoveStep {
  code: 'field-remove'
  names: string[]
}

export interface IFieldUpdateStep {
  code: 'field-update'
  name: string
  value?: any
  formula?: string
  newName?: string
}
