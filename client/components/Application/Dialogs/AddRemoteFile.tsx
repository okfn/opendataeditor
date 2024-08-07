import * as React from 'react'
import UploadIcon from '@mui/icons-material/Upload'
import InputDialog from '../../Parts/Dialogs/Input'
import * as store from '@client/store'
import * as helpers from '../../../helpers'

export default function AddRemoteFileDialog() {
  const [loading, setLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')

  const onChange = () => {
    if (errorMessage) {
      setErrorMessage('')
    }
  }

  const onConfirm = async (url: string) => {
    if (!url) {
      setErrorMessage('The URL is blank')
      return
    }

    if (!helpers.isUrlValid(url)) {
      setErrorMessage('The URL is not valid')
      return
    }

    try {
      setLoading(true)
      await store.fetchFile(url)
    } catch (error) {
      if (url.includes('docs.google.com/spreadsheets')) {
        setErrorMessage(
          'The Google Sheets URL is not valid or the table is not publically available'
        )
      } else {
        setErrorMessage('The URL is not associated with a table')
      }
      return
    } finally {
      setLoading(false)
    }

    store.closeDialog()
  }

  return (
    <InputDialog
      open={true}
      title="Add Remote File"
      label="Add"
      Icon={UploadIcon}
      errorMessage={errorMessage}
      description="You are adding a tabular file. Enter the source:"
      placholder="Enter or paste a URL"
      onCancel={store.closeDialog}
      onConfirm={onConfirm}
      onChange={onChange}
      loading={loading}
    />
  )
}
