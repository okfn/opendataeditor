export interface IDict<T extends any = any> {
  [key: string]: T
}
export type IData = IDict
