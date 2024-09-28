import { openDialog } from '../client/store/actions/dialog'

// @ts-ignore
window?.opendataeditor?.createNewFolder( ( value: string ) => {
    console.log('value', value)
    openDialog('addEmptyFolder')
})