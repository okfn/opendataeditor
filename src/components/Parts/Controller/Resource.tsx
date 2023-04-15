import { IFile } from '../../../interfaces'
import { Client } from '../../../client'

export interface ResourceControllerProps {
  file: IFile
  client: Client
  onSaveAs?: (path: string) => void
  onSave?: () => void
}
