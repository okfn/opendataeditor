import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import TextEditor from '../../../Editors/Text'

export type SourcePanelProps =
  | {
      json?: false
      value?: string
      onChange?: (text: string) => void
    }
  | {
      json: true
      value?: any
      onChange?: (data: any) => void
    }

export default function SourcePanel(props: SourcePanelProps) {
  const theme = useTheme()
  if (props.value === undefined) return null
  return (
    <Box>
      <TextEditor
        value={props.json ? JSON.stringify(props.value, null, 2) : props.value}
        onChange={(text) => {
          if (props.json) {
            try {
              text = JSON.parse(text || '{)')
            } catch (error) {}
          }
          if (props.onChange) props.onChange(text || '')
        }}
        language="json"
        options={{ readOnly: !props.onChange }}
        height={theme.spacing(41)}
      />
    </Box>
  )
}
