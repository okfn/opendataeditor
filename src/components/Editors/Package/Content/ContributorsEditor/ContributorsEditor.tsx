import * as React from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { useStore } from '../../store'
import ContributorsForm from './ContributorsForm'
import ContributorsItem from './ContributorsItem'
import DefaultButton from '../../../../Parts/Buttons/DefaultButton'
import HeadingBox from '../../../../Parts/Groups/HeadingBox'
import { Grid } from '@mui/material'

export default function Contributors() {
  const theme = useTheme()
  const contributorsList = useStore((state) => state.descriptor.contributors) || []
  const update = useStore((state) => state.update)
  const [open, setOpen] = React.useState(false)

  const onDelete = (id: string) => {
    const newContributorsList = contributorsList.filter((item) => item.id !== id)
    update({ contributors: newContributorsList })
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplate: '1fr / 70% 30%',
        }}
      >
        {!contributorsList.length ? (
          <p
            style={{
              textAlign: 'left',
              color: 'rgba(0,0,0,0.6)',
              display: 'block',
            }}
          >
            Contributors list is not defined
          </p>
        ) : (
          <HeadingBox>Contributors</HeadingBox>
        )}
        <DefaultButton
          variant="text"
          label="Add a contributor"
          onClick={() => setOpen(true)}
        />
      </Box>
      <Box
        sx={{
          height: theme.spacing(53),
          maxHeight: theme.spacing(53),
          overflowY: 'scroll',
        }}
      >
        <Grid container rowSpacing={2} columnSpacing={4} justifyContent="space-between">
          {contributorsList.map(({ id, title, email, path, role }) => {
            return (
              <ContributorsItem
                key={id}
                title={title}
                email={email}
                path={path}
                role={role}
                id={id}
                onDelete={onDelete}
              />
            )
          })}
        </Grid>
      </Box>
      <ContributorsForm modalOpen={open} handleClose={() => setOpen(false)} />
    </Box>
  )
}
