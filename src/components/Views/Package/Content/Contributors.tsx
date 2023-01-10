import * as React from 'react'
import Grid from '@mui/material/Grid'
import InputField from '../../Library/Fields/InputField'
import { useStore } from '../store'

export default function Contributors() {
  const contributorsList = useStore((state) => state.descriptor.contributors)
  return (
    <>
      <ContributorsInput />
      {contributorsList && (
        <Grid container spacing={2}>
          {contributorsList.map((item) => {
            return (
              <Grid item xs={6} key={item.id}>
                <div>{item.name}</div>
              </Grid>
            )
          })}
        </Grid>
      )}
    </>
  )
}

function ContributorsInput() {
  const contributorsList = useStore((state) => state.descriptor.contributors)
  const setElementName = useStore((state) => state.setElementName)
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
      onFocus={() => {
        setElementName('contributor')
      }}
    />
  )
}
