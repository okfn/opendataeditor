import * as React from 'react'
import List from '@mui/material/List'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { useStore } from '../../store'
import ContributorsInput from './ContributorsInput'
import ContributorsItem from './ContributorsItem'

export default function Contributors() {
  const theme = useTheme()
  const contributorsList = useStore((state) => state.descriptor.contributors) || []
  const update = useStore((state) => state.update)
  // logic
  const onAdd = (name: string) => {
    const newContributor = {
      id: Math.floor(Math.random() * (10000 - 0) + 0) + name.slice(0, 3),
      name: name,
    }
    const contributors = [newContributor, ...contributorsList]

    update({ contributors })
  }
  const onDelete = (id: string) => {
    const newContributorsList = contributorsList.filter((item) => item.id !== id)
    update({ contributors: newContributorsList })
  }
  const onEdit = (id: string, name: string) => {
    const contributors = contributorsList.map((item) => ({
      ...item,
      name: item.id === id ? name : item.name,
    }))
    update({ contributors })
  }

  return (
    <div>
      <ContributorsInput onAdd={onAdd} />
      <Box
        sx={{
          height: theme.spacing(34),
          maxHeight: theme.spacing(34),
          overflowY: 'scroll',
        }}
      >
        {!contributorsList.length && (
          <p style={{ textAlign: 'left', color: 'rgba(0,0,0,0.6)' }}>
            Contributors list is not defined
          </p>
        )}
        <List>
          {contributorsList.map(({ id, name }) => {
            return (
              <ContributorsItem
                key={id}
                name={name}
                id={id}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )
          })}
        </List>
      </Box>
    </div>
  )
}
