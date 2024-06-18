import BaseError from '../Base/Error'
import { useStore } from './store'

export default function Error() {
  const updateState = useStore((state) => state.updateState)
  const error = useStore((state) => state.error)
  if (!error) return null
  return (
    <BaseError
      detail={error.detail}
      onClose={() => updateState({ dialog: undefined, error: undefined })}
    />
  )
}
