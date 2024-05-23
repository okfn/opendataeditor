import * as React from 'react'
import UploadIcon from '@mui/icons-material/Upload'
import InputDialog from '../../Parts/Dialogs/Input'
import { useStore } from '../store'
import * as helpers from '../../../helpers'

export default function AddRemoteFileDialog() {
  const fetchFile = useStore((state) => state.fetchFile)
  const updateState = useStore((state) => state.updateState)
  const [textFieldError, setTextFieldError] = React.useState(false)
  const [errorHelperText, setErrorHelperText] = React.useState('')

  return (
    <InputDialog
      open={true}
      title="Add Remote File"
      label="Add"
      Icon={UploadIcon}
      textFieldError={textFieldError}
      errorHelperText={errorHelperText}
      description="You are fetching a file. Enter source:"
      placholder="Enter or paste a URL"
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async (url) => {
        if (url !== '' && helpers.isUrlValid(url)) {
          setTextFieldError(false)
          await fetchFile(url)
          updateState({ dialog: undefined })
        } else {
          setTextFieldError(true)
          if (url === '') {
            setErrorHelperText('Enter an URL')
          } else if (!helpers.isUrlValid(url)) {
            setErrorHelperText('Enter a valid URL')
          }
        }
      }}
    />
  )
}
