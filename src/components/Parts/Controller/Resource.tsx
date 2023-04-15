import { Client } from '../../../client'

export interface ResourceControllerProps {
  path: string
  client: Client
  onSave?: () => void
  onSaveAs?: (path: string) => void
}
