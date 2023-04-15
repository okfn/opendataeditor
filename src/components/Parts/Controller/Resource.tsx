import { IFile } from '../../../interfaces'
import { Client } from '../../../client'

export interface ResourceControllerProps {
  file: IFile
  client: Client
  onSave?: () => void
  onSaveAs?: (path: string) => void
}
