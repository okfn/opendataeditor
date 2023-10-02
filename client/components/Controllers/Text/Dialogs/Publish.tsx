import PublishDialog from '../../Base/Dialogs/Publish'
import { useStore } from '../store'

export default function Publish() {
  const record = useStore((state) => state.record)
  const publish = useStore((state) => state.publish)
  const updateState = useStore((state) => state.updateState)
  if (!record) return
  return (
    <PublishDialog
      onClose={() => updateState({ dialog: undefined })}
      onPublish={publish}
      onPublishNote={
        record.type === 'article'
          ? 'it might take a few minutes for the article to get deployed'
          : undefined
      }
    />
  )
}
