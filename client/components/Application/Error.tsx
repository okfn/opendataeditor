import ErrorDialog from '../Parts/Dialogs/Error'
import * as store from '@client/store'

export default function Error() {
  const error = store.useStore((state) => state.error)
  if (!error) return null

  return <ErrorDialog detail={error.detail} onClose={store.closeError} />
}
