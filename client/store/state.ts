import { IMainState } from './main/types'

export type IState = {
  main: IMainState
}

export const initialState: IState = {
  main: {
    files: [],
  },
}
