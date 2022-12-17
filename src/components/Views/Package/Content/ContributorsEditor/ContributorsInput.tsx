import * as React from 'react'
import Box from '@mui/material/Box'
import AddBoxIcon from '@mui/icons-material/AddBox'
import InputField from '../../../Library/Fields/InputField'

interface ContributorsInputProps {
  onAdd: (name: string) => void
}

export default function ContributorsInput(props: ContributorsInputProps) {
  const { onAdd } = props
  const [inputValue, setInputValue] = React.useState('')
  const addContributor = React.useCallback(() => {
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
        label="Contributors"
        value={inputValue}
        onChange={(name) => setInputValue(name)}
        onKeyDown={(e) => {
          e.key === 'Enter' && addContributor()
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
        onClick={addContributor}
      />
    </Box>
  )
}
