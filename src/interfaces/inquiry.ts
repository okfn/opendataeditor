import { IResource } from './resource'

// TODO: sync in frictionless@5

export interface IInquiry {
  // TODO: make required
  source?: IResource
  checks: ICheck[]
  pickErrors?: string[]
  skipErrors?: string[]
  limitErrors?: number
}

export interface ICheck {
  code: string
  // TODO: rebase on normal props
  descriptor: string
}
