import * as React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import registry from '../../../libraries/vega-presets/registry'
import { useStore } from './store'

export default function Preset() {
  const updateState = useStore((state) => state.updateState)
  return (
    <Box sx={{ padding: 2 }}>
      {registry.groups.map((group) => (
        <Box key={group.config.type}>
          <Typography variant="h5">{group.config.title}</Typography>
          {group.config.presets.map((preset) => (
            <Box key={preset.config.type} sx={{ paddingY: 2 }}>
              <img
                src={preset.config.image}
                width="100px"
                onClick={() => updateState({ preset: preset.config.type })}
                style={{ cursor: 'pointer' }}
              />
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  )
}
