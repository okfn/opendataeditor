import * as React from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import InputField from '../../Library/Fields/InputField'
import { useStore } from '../store'
import BasicChip from '../../Library/Chips'

export default function KeywordsEditor() {
  const theme = useTheme()
  const contributorsList = useStore((state) => state.descriptor.contributors) || []
  // const update = useStore((state) => state.update)
  // const handleDelete = (id: string) => {
  //   const newContributorsList = contributorsList.filter((item) => item.id !== id)
  //   update({ newContributorsList })
  // }
  return (
    <>
      <ContributorsInput />
      <Box
        sx={{
          height: theme.spacing(34),
          maxHeight: theme.spacing(34),
          overflowY: 'scroll',
        }}
      >
        <Grid container spacing={2}>
          {contributorsList.map((item) => {
            return (
              <BasicChip
                key={item.id}
                label={item.name}
                // onDelete={handleDelete(item.id)}
              />
            )
          })}
        </Grid>
      </Box>
    </>
  )
}

function ContributorsInput() {
  const contributorsList = useStore((state) => state.descriptor.contributors)
  const update = useStore((state) => state.update)
  const [inputValue, setInputValue] = React.useState('')
  const addContributor = React.useCallback(() => {
    const newContributor = {
      id: Math.random() * (10000 - 0) + 0 + inputValue.slice(0, 3),
      name: inputValue,
    }
    update({ newContributor, ...contributorsList })
    setInputValue('')
  }, [inputValue])
  console.log(contributorsList)

  return (
    <InputField
      size="medium"
      label="Contributors"
      value={inputValue}
      onChange={(name) => setInputValue(name)}
      onKeyDown={(e) => {
        e.key === 'Enter' && addContributor()
      }}
    />
  )
}
