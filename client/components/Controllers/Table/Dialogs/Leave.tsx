import LeaveDialog from '../../Base/Dialogs/Leave'
import { useStore } from '../store'

export default function Leave() {
  const updateState = useStore((state) => state.updateState)
  return <LeaveDialog onClose={() => updateState({ dialog: undefined })} />
}
