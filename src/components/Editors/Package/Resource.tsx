import * as React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { IResource } from '../../../interfaces'
import { useStore } from './store'

export interface ResourceProps {
  resource: IResource
}

export default function Resource(props: ResourceProps) {
  const onPathChange = useStore((state) => state.onPathChange)
  return (
    <Box>
      <Card variant="outlined">
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {props.resource.type.toUpperCase()}
          </Typography>
          <Typography variant="h5" component="div">
            {props.resource.title || props.resource.name}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {props.resource.path}
          </Typography>
          <Typography variant="body2">
            {props.resource.description || 'No description'}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            title="Explore resource"
            size="small"
            onClick={() => onPathChange(props.resource.path)}
          >
            Explore
          </Button>
          <Button
            title="Remove resource from the data package"
            size="small"
            color="warning"
            onClick={() => onPathChange(props.resource.path)}
          >
            Remove
          </Button>
        </CardActions>
      </Card>
    </Box>
  )
}
