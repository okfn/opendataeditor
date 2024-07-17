import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import TextEditor from '../../../Editors/Text'
import * as types from '../../../../types'

export type SourcePanelProps<T extends string | types.IData> = {
  value?: T
  language?: string
  onChange?: (value: T) => void
}

export function JsonSourcePanel(props: SourcePanelProps<types.IData>) {
  const { value, onChange, ...others } = props

  return (
    <TextSourcePanel
      language="json"
      value={JSON.stringify(value, null, 2)}
      onChange={
        onChange
          ? (text) => {
              try {
                const data = JSON.parse(text || '{)')
                onChange(data)
              } catch (error) {}
            }
          : undefined
      }
      {...others}
    />
  )
}

export function TextSourcePanel(props: SourcePanelProps<string>) {
  const theme = useTheme()
  if (props.value === undefined) return null

  return (
    <Box>
      <TextEditor
        value={props.value}
        onChange={(value) => props.onChange?.(value || '')}
        language={props.language || 'plaintext'}
        options={{ readOnly: !props.onChange }}
        height={theme.spacing(41)}
      />
    </Box>
  )
}
