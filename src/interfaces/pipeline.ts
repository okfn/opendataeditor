import { IResource } from './resource'

// TODO: sync in frictionless@5

export interface IPipeline {
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
