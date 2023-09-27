import PublishDialog from '../../Base/Dialogs/Publish'
import { useStore } from '../store'

export default function Publish() {
  const publish = useStore((state) => state.publish)
  const updateState = useStore((state) => state.updateState)
  return (
    <PublishDialog
      onPublish={publish}
      onClose={() => updateState({ dialog: undefined })}
    />
  )
}
