import { Client } from '../../../client'

export default interface ControllerProps {
  path: string
  client: Client
  isDraft?: boolean
  onSave?: () => void
  onSaveAs?: (path: string) => void
  onRevert?: () => void
}
