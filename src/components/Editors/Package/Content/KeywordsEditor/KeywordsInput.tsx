import * as React from 'react'
import Box from '@mui/material/Box'
import AddBoxIcon from '@mui/icons-material/AddBox'
import InputField from '../../../../Library/Fields/InputField'
import { useStore } from '../../store'

interface KeywordsInputProps {
  onAdd: (keyword: string) => void
}

export default function KeywordsInput(props: KeywordsInputProps) {
  const { onAdd } = props
  const [inputValue, setInputValue] = React.useState('')
  const setElementName = useStore((state) => state.setElementName)
  const addKeyword = React.useCallback(() => {
    if (inputValue.length) {
      onAdd(inputValue)
      setInputValue('')
    }
  }, [inputValue])
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <InputField
        size="small"
        label="Keywords"
        value={inputValue}
        onChange={(keyword) => setInputValue(keyword)}
        onKeyDown={(e) => {
          e.key === 'Enter' && addKeyword()
        }}
        onFocus={() => {
          setElementName('keyword')
        }}
      />
      <AddBoxIcon
        color="primary"
        sx={{
          margin: '16px 0 8px 0',
          fontSize: '50px',
          cursor: 'pointer',
          transition: 'all 0.3s',
          '&: hover': { opacity: 0.7 },
        }}
        onClick={addKeyword}
      />
    </Box>
  )
}
