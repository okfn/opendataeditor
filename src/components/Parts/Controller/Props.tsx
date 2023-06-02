import { Client } from '../../../client'

export default interface ControllerProps {
  path: string
  client: Client
  onSave?: () => void
  onSaveAs?: (path: string) => void
}
