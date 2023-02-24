export interface IView {
  query: string
}

export enum ViewErrorLocation {
  Backend,
  Frontend
}

export interface IViewError {
  message: string
  location: ViewErrorLocation
}
