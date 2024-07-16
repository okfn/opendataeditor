import PublishDialog from '../../Base/Dialogs/Publish'
import * as store from '@client/store'

export default function Publish() {
  return <PublishDialog onPublish={store.publishTable} onClose={store.closeDialog} />
}
