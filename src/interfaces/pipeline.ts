import { IResource } from './resource'

export interface IPipeline {
  tasks: IPipelineTask[]
}

export interface IPipelineTask {
  // TODO: make required
  source?: IResource
  type: string
  steps: IStep[]
}

export interface IStep {
  code: string
  // TODO: rebase on normal props
  descriptor: string
}
