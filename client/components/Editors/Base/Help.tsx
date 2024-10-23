import Box from '@mui/material/Box'
import HelpCard from '../../Parts/Cards/Help'
import * as types from '../../../types'

interface EditorHelpProps {
  helpItem: types.IHelpItem
  withIcon?: boolean
}

export default function EditorHelp(props: EditorHelpProps) {
  const { helpItem, withIcon } = props
  return (
    <Box sx={{ height: '100%' }}>
      <HelpCard
        title={helpItem.title}
        subtitle={helpItem.path}
        link={helpItem.link}
        withIcon={withIcon}
      >
        {helpItem.description}
      </HelpCard>
    </Box>
  )
}
