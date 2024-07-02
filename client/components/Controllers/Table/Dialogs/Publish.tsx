import PublishDialog from '../../Base/Dialogs/Publish'
import { useStore } from '../store'
import * as store from '@client/store'

export default function Publish() {
  const publish = useStore((state) => state.publish)

  return <PublishDialog onPublish={publish} onClose={store.closeDialog} />
}
