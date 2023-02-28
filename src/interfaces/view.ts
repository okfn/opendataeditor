export interface IView {
  query: string
  validQuery: boolean
}

export enum ViewErrorLocation {
  Backend,
  Frontend,
}

export interface IViewError {
  message: string
  location: ViewErrorLocation
}
