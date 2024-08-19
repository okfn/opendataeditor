import * as React from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import DialogContent from '@mui/material/DialogContent'
import CloseIcon from '@mui/icons-material/Close'
import * as store from '@client/store'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { styled } from '@mui/material/styles'
import uploadFilesDialogImg from '../../../assets/dialog_upload_files.png'
import iconUploadFileImg from '../../../assets/icon_upload_file.png'
import iconUploadFolderImg from '../../../assets/folder-open-big-plus.png'
import iconLinkTextField from '../../../assets/icon_link_textfield.svg'
import Columns from '../../Parts/Grids/Columns'
import SimpleButton from '../../Parts/Buttons/SimpleButton'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import * as helpers from '../../../helpers'

export default function FileUploadDialog() {
  const [errorMessage, setErrorMessage] = React.useState('')

  const handleClose = () => {
    store.closeDialog()
  }

  const [value, setValue] = React.useState(0)

  const [remoteUrlValue, setRemoteUrlValue] = React.useState('')

  const [loading, setLoading] = React.useState(false)

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }

  // by default the height of the tabs is set by its content, to avoid the height jump
  // when changing the tabs we assign the second tab whatever is the height of the first one
  const tabRefForHeight = React.useRef<HTMLDivElement>(null)
  const [tabHeight, setTabHeight] = React.useState(0)

  React.useEffect(() => {
    tabRefForHeight.current ? setTabHeight(tabRefForHeight.current.clientHeight) : null
  }, [tabRefForHeight])

  // the event needs to be passed even if not used, disabling here so there's
  // no unused variable error in the typescript check
  // @ts-ignore
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const inputFileRef = React.useRef<HTMLInputElement>(null)
  const inputFolderRef = React.useRef<HTMLInputElement>(null)

  const onAddRemoteTextfieldChange = (url: string) => {
    if (errorMessage) {
      setErrorMessage('')
    } else {
      setRemoteUrlValue(url)
    }
  }

  const onAddRemoteConfirm = async (url: string) => {
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
      setErrorMessage('The URL is not associated with a table')
      return
    } finally {
      setLoading(false)
    }

    store.closeDialog()
  }

  const isWebkitDirectorySupported = 'webkitdirectory' in document.createElement('input')
  if (!isWebkitDirectorySupported) return null

  return (
    <Dialog
      fullWidth
      open={true}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      onKeyDown={(event) => {
        if (event.key === 'F' || event.key === 'f') {
          inputFileRef.current ? inputFileRef.current.click() : null
        }
        if (event.key === 'G' || event.key === 'g') {
          inputFolderRef.current ? inputFolderRef.current.click() : null
        }
      }}
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
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="File Upload Tabs"
            centered
          >
            <Tab label="From your computer" {...a11yProps(0)} />
            <Tab label="Add external data" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Box ref={tabRefForHeight}>
            <Columns columns={2} spacing={4}>
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
                  ref={inputFileRef}
                  onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                    if (ev.target.files) {
                      store.addFiles(ev.target.files)
                      store.closeDialog()
                    }
                  }}
                />
                <Box sx={{ padding: '32px 48px 24px 48px' }}>
                  <Box>
                    <img src={iconUploadFileImg} alt="Icon Upload File" />
                  </Box>
                  <Box>Add one or more Excel or csv files </Box>
                  <StyledSelectBox className="file-select__button">
                    Select <span>F</span>
                  </StyledSelectBox>
                </Box>
              </FileSelectBox>
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
                  ref={inputFolderRef}
                  onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                    if (ev.target.files) {
                      store.addFiles(ev.target.files)
                      store.closeDialog()
                    }
                  }}
                  // @ts-expect-error
                  webkitdirectory=""
                />
                <Box sx={{ padding: '32px 48px 24px 48px' }}>
                  <Box>
                    <img src={iconUploadFolderImg} alt="Icon Upload File" />
                  </Box>
                  <Box>Add one or more folders</Box>
                  <StyledSelectBox className="file-select__button">
                    Select <span>G</span>
                  </StyledSelectBox>
                </Box>
              </FileSelectBox>
            </Columns>
          </Box>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Box sx={{ paddingLeft: '140px', paddingRight: '140px', minHeight: tabHeight }}>
            <Box
              sx={{
                fontSize: '14px',
              }}
            >
              Link to the external table:
            </Box>
            <Box sx={{ display: 'flex' }}>
              <AddRemoteTextfield
                value={remoteUrlValue}
                errorMessage={errorMessage}
                onChange={onAddRemoteTextfieldChange}
              />
              {loading ? (
                <CircularProgress
                  size={'2rem'}
                  sx={{
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#00D1FF',
                    },
                    padding: '10px',
                  }}
                />
              ) : null}
            </Box>
            <SimpleButton
              label={'Add'}
              sx={{ my: 0.5, marginTop: '53px' }}
              variant="contained"
              aria-label="accept"
              disabled={!remoteUrlValue}
              onClick={() => onAddRemoteConfirm(remoteUrlValue)}
            />
          </Box>
        </CustomTabPanel>
      </DialogContent>
    </Dialog>
  )
}

function CustomTabPanel(props: {
  children?: React.ReactNode
  index: number
  value: number
}) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
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
  '& span': {
    backgroundColor: '#4C5564',
    fontSize: '12px',
    padding: '2px 4px',
    borderRadius: '2px',
    lineHeight: 1,
    color: 'white',
    marginLeft: '4px',
  },
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
