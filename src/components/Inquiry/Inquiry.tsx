import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { IInquiry, ISchema } from '../../interfaces'
import { Provider, makeStore } from './store'
import Actions from './Actions'
import Editor from './Editor'

// TODO: remove borderTop hack

export interface InquiryProps {
  descriptor: IInquiry
  schema: ISchema
  onCommit?: (descriptor: IInquiry) => void
  onRevert?: (descriptor: IInquiry) => void
}

export default function Inquiry(props: InquiryProps) {
  const theme = useTheme()
  return (
    <Provider createStore={() => makeStore(props)}>
      <Box sx={{ height: theme.spacing(56) }}>
        <Box>
          <Editor />
        </Box>
        <Box sx={{ height: theme.spacing(8) }}>
          <Actions />
        </Box>
      </Box>
    </Provider>
  )
}
