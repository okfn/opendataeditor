import SaveAsDialog from '../../Base/Dialogs/SaveAs'
import * as store from '@client/store'

export default function SaveAs() {
  const path = store.useStore((state) => state.path)

  return <SaveAsDialog path={path} onSave={store.forkText} onClose={store.closeDialog} />
}
