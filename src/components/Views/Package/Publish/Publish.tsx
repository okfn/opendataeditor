import * as React from 'react'
import Ckan from './Ckan'
import Github from './Github'
import Zenodo from './Zenodo'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import { DialogContent } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import VerticalTabs from '../../../Views/Library/VerticalTabs'
import { IPublish } from '../../../../interfaces/publish'

interface PublishProps {
  open: boolean
  togglePublish: () => void
  publishPackage: (params: IPublish) => any
}

export default function Publish(props: PublishProps) {
  const [open, setOpen] = React.useState(false)
  const [responseMessage, setResponseMessage] = React.useState<any>(null)

  // Hooks
  React.useEffect(() => {
    setOpen(!!props.open)
  })

  // Event Handlers
  const onCancelPublish = () => {
    setOpen(false)
    props.togglePublish()
  }
  const onPublish = (params: IPublish) => {
    return props
      .publishPackage(params)
      .then((response: any) => {
        const responseObj = JSON.parse(response)
        if (responseObj.url) {
          setResponseMessage({
            type: 'success',
            message: `Successfully published to "${responseObj.url}"`,
          })
        } else if (responseObj.error) {
          setResponseMessage({
            type: 'error',
            message: `Error publishing package. "${responseObj.error.message}"`,
          })
        }
      })
      .catch(console.error)
  }
  return (
    <React.Fragment>
      <Dialog open={open}>
        <DialogTitle>
          Publish Your Data
          <IconButton
            aria-label="close"
            onClick={onCancelPublish}
            sx={{ position: 'absolute', right: 8, top: 8, color: 'grey' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            borderStyle: 'dotted',
            borderWidth: 1,
            borderRadius: 1,
            marginX: 2,
            marginBottom: 2,
          }}
        >
          <VerticalTabs labels={['Github', 'Zenodo', 'CKAN']} index={0}>
            <Github
              publish={onPublish}
              onCancelPublish={onCancelPublish}
              responseMessage={responseMessage}
            />
            <Zenodo
              publish={onPublish}
              onCancelPublish={onCancelPublish}
              responseMessage={responseMessage}
            />
            <Ckan
              publish={onPublish}
              onCancelPublish={onCancelPublish}
              responseMessage={responseMessage}
            />
          </VerticalTabs>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}
