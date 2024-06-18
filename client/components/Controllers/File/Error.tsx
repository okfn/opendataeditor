import ErrorDialog from '../../Parts/Dialogs/Error'
import { useStore } from './store'

export default function Error() {
  const updateState = useStore((state) => state.updateState)
  const error = useStore((state) => state.error)
  if (!error) return null
  return (
    <ErrorDialog
      detail={error.detail}
      onClose={() => updateState({ error: undefined })}
    />
  )
}
