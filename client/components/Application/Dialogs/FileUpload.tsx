import * as store from '@client/store'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import LinearProgress from '@mui/material/LinearProgress'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'
import * as React from 'react'
import uploadFilesDialogImg from '../../../assets/dialog_upload_files.png'
import iconUploadFolderImg from '../../../assets/folder-open-big-plus.png'
import iconLinkTextField from '../../../assets/icon_link_textfield.svg'
import iconUploadFileImg from '../../../assets/icon_upload_file.png'
import * as helpers from '../../../helpers'
import SimpleButton from '../../Parts/Buttons/SimpleButton'
import Columns from '../../Parts/Grids/Columns'
import DialogTabs from '../../Parts/Tabs/Dialog'

export default function FileUploadDialog() {
  const tabLabels = ['From your computer', 'Add external data']

  const handleClose = () => {
    store.closeDialog()
  }

  return (
    <Dialog
      fullWidth
      open={true}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      onClose={handleClose}
    >
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ paddingTop: 0, paddingBottom: '82px' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '74px',
            paddingBottom: '33px',
          }}
        >
          <img src={uploadFilesDialogImg} alt="Image Folder Dialog" />
        </Box>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <DialogTabs labels={tabLabels}>
            <Box sx={{ minHeight: '15em' }}>
              <Columns columns={2} spacing={4}>
                <UploadFiles />
                <UploadFolders />
              </Columns>
            </Box>
            <Box sx={{ minHeight: '15em' }}>
              <UploadRemoteFile />
            </Box>
          </DialogTabs>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

function UploadFiles() {
  const [loading, setLoading] = React.useState(false)

  const handleUpload = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (ev.target.files) {
      setLoading(true)
      await store.addFiles(ev.target.files)
      store.openDialog('openLocation')
    }
  }

  return (
    <Box>
      <FileSelectBox
        sx={{
          ':hover': {
            borderColor: (theme) => theme.palette.primary.main,
          },
        }}
      >
        <input type="file" multiple onChange={handleUpload} />
        <Box sx={{ padding: '32px 48px 24px 48px' }}>
          <Box>
            <img src={iconUploadFileImg} alt="Icon Upload File" />
          </Box>
          <Box>Add one or more Excel or csv files </Box>
          <StyledSelectBox className="file-select__button">Select</StyledSelectBox>
        </Box>
      </FileSelectBox>
      {!!loading && <LoadingProgress />}
    </Box>
  )
}

function UploadFolders() {
  const isWebkitDirectorySupported = 'webkitdirectory' in document.createElement('input')
  if (!isWebkitDirectorySupported) {
    return null
  }

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (ev.target.files) {
      store.addFiles(ev.target.files)
      store.closeDialog()
    }
  }

  return (
    <FileSelectBox
      sx={{
        ':hover': {
          borderColor: (theme) => theme.palette.primary.main,
        },
      }}
    >
      <input
        type="file"
        multiple
        onChange={handleChange}
        // @ts-expect-error
        webkitdirectory=""
      />
      <Box sx={{ padding: '32px 48px 24px 48px' }}>
        <Box>
          <img src={iconUploadFolderImg} alt="Icon Upload File" />
        </Box>
        <Box>Add one or more folders</Box>
        <StyledSelectBox className="file-select__button">Select</StyledSelectBox>
      </Box>
    </FileSelectBox>
  )
}

function UploadRemoteFile() {
  const [errorMessage, setErrorMessage] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [value, setValue] = React.useState('')

  const handleChange = (url: string) => {
    if (errorMessage) {
      setErrorMessage('')
    } else {
      setValue(url)
    }
  }

  const handleConfirm = async () => {
    if (!value) {
      setErrorMessage('The URL is blank')
      return
    }

    if (!helpers.isUrlValid(value)) {
      setErrorMessage('The URL is not valid')
      return
    }

    try {
      setLoading(true)
      await store.fetchFile(value)
      store.openDialog('openLocation')
    } catch (error) {
      if (value.includes('docs.google.com/spreadsheets')) {
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
  }

  return (
    <Box sx={{ paddingLeft: '140px', paddingRight: '140px' }}>
      <Box sx={{ fontSize: '14px' }}>Link to the external table:</Box>
      <Box sx={{ display: 'flex' }}>
        <AddRemoteTextfield
          value={value}
          errorMessage={errorMessage}
          onChange={handleChange}
        />
      </Box>
      <SimpleButton
        label={'Add'}
        sx={{ my: 0.5, marginTop: '53px' }}
        variant="contained"
        aria-label="accept"
        disabled={!value}
        onClick={handleConfirm}
      />
      {!!loading && <LoadingProgress />}
    </Box>
  )
}

function AddRemoteTextfield(props: {
  errorMessage?: string
  value: string
  onChange(value: string): void
}) {
  return (
    <StyledTextField
      fullWidth
      size="small"
      error={!!props.errorMessage}
      helperText={props.errorMessage || ' '}
      placeholder="Enter or paste URL"
      InputLabelProps={{
        sx: {
          fontSize: '14px',
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <img src={iconLinkTextField} alt="" />
          </InputAdornment>
        ),
        sx: {
          '& ::placeholder': {
            color: '#D1D4DB',
            opacity: 1, // otherwise firefox shows a lighter colorS
            fontSize: '14px',
          },
        },
      }}
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
    />
  )
}

function LoadingProgress() {
  return (
    <Box sx={{ py: '1em' }}>
      <Box>Loading...</Box>
      <LinearProgress
        sx={{
          '& .MuiLinearProgress-bar': {
            backgroundColor: '#00D1FF',
          },
          padding: '10px',
        }}
      />
    </Box>
  )
}

const FileSelectBox = styled(Box)(() => ({
  border: '1px solid #E7E9E9',
  borderRadius: '8px',
  textAlign: 'center',
  color: '#717879',
  fontSize: '14px',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  '& input': {
    position: 'absolute',
    height: '100%',
    width: '100%',
    opacity: 0,
    cursor: 'pointer',
  },
  ':hover .file-select__button': {
    backgroundColor: '#3F4345',
    color: 'white',
  },
}))

const StyledSelectBox = styled(Box)(() => ({
  marginTop: '28px',
  backgroundColor: '#FAFAFA',
  padding: '4px 10px',
  borderRadius: '4px',
  border: '0.5px solid #D3D7D8',
  lineHeight: '20px',
  boxShadow: '0px 0px 0px 0px rgba(0, 0, 0, 0.25)',
}))

const StyledTextField = styled(TextField)(() => ({
  marginTop: '8px',
  fontSize: '14px',
  '& label.Mui-focused': {
    color: '#00D1FF',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#00D1FF',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'gray',
    },
    '&:hover fieldset': {
      borderColor: '#00D1FF',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#00D1FF',
    },
  },
}))
