import * as React from 'react'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import EditIcon from '@mui/icons-material/Edit'
import ConfirmDialog from '../../../Parts/Dialogs/Confirm'
import MultilineField from '../../../Parts/Fields/Multiline'
import Columns from '../../../Parts/Grids/Columns'
import MenuTree from '../../../Parts/Trees/Menu'
import * as types from '../../../../types'

export interface ChatDialogProps {
  onEdit: (prompt: string) => Promise<void>
  onClose: () => void
}

interface IMenuItem extends types.IMenuItem {
  description: string
  placeholder: string
  Icon: React.ElementType
  chat: (prompt: string) => Promise<void>
}

export default function ChatDialog(props: ChatDialogProps) {
  const MENU_ITEMS: IMenuItem[] = [
    {
      name: 'Edit',
      section: 'edit',
      description: 'Edit current file. Enter Chat AI prompt:',
      placeholder: 'Enter a prompt',
      Icon: EditIcon,
      chat: props.onEdit,
    },
  ]

  const [prompt, setPrompt] = React.useState('')
  const [section, setSection] = React.useState('edit')
  const [loading, setLoading] = React.useState(false)
  const menuItem = MENU_ITEMS.find((item) => item.section === section)
  if (!menuItem) return null

  const handleSectionChange = (newSection: string) => {
    if (section === newSection) return
    const menuItem = MENU_ITEMS.find((item) => item.section === newSection)
    if (!menuItem) return
    setPrompt('')
    setSection(newSection)
  }

  return (
    <ConfirmDialog
      ctrlEnter
      open={true}
      maxWidth="md"
      title={menuItem.name}
      label={menuItem.name}
      Icon={menuItem.Icon}
      disabled={loading}
      onCancel={props.onClose}
      onConfirm={async () => {
        if (!menuItem) return
        setLoading(true)
        await menuItem.chat(prompt)
        setLoading(false)
        props.onClose()
      }}
    >
      <Columns layout={[3, 9]} spacing={2}>
        <Box sx={{ paddingRight: 2, marginBottom: 1, borderRight: 'solid 1px #ddd' }}>
          <MenuTree
            menuItems={MENU_ITEMS}
            selected={section}
            onSelect={handleSectionChange}
          />
        </Box>
        <Box>
          {menuItem.description}
          <MultilineField
            rows={3}
            label="Prompt"
            value={prompt}
            onChange={setPrompt}
            placeholder={menuItem.placeholder}
          />
          {loading && (
            <Box sx={{ borderTop: 'solid 1px #ddd', paddingY: 2, maringTop: 2 }}>
              Chatting
              <LinearProgress />
            </Box>
          )}
        </Box>
      </Columns>
    </ConfirmDialog>
  )
}
