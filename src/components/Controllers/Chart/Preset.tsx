import * as React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import registry from '../../../libraries/vega-presets/registry'

export default function Preset() {
  return (
    <Box sx={{ padding: 2 }}>
      {registry.map((group) => (
        <Box key={group.title}>
          <Typography variant="h5">{group.title}</Typography>
          {group.Presets.map((Preset) => (
            <Box key={Preset.type} sx={{ paddingY: 2 }}>
              <img src={Preset.image} width="150px" />
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  )
}
