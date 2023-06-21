import { Client } from '../../../client'

export interface ControllerProps {
  path: string
  client: Client
  onSave?: () => void
  onSaveAs?: (path: string) => void
}
