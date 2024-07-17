export type IEvent = IFileEvent

export interface IFileEvent {
  type: 'create' | 'delete' | 'update' | 'locate' | 'open'
  paths: string[]
}
