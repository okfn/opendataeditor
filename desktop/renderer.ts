import { openDialog } from '../client/store/actions/dialog'

// @ts-ignore
window?.opendataeditor?.onCreateNewFolder( () => {
    openDialog('addEmptyFolder')
})