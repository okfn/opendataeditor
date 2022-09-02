export type ISession = string | null
export interface IDict<T extends any = any> {
  [key: string]: T
}
