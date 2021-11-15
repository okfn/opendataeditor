import { IResource } from './resource'

export interface IInquiry {
  tasks: IInquiryTask[]
}

export interface IInquiryTask {
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
