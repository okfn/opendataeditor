import SaveAsDialog from '../../Base/Dialogs/SaveAs'
import { useStore } from '../store'
import * as store from '@client/store'

export default function SaveAs() {
  const path = useStore((state) => state.path)
  const saveAs = useStore((state) => state.saveAs)

  return <SaveAsDialog path={path} onSave={saveAs} onClose={store.closeDialog} />
}
