import * as React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Registry } from '../../../libraries/vega-presets/registry'
import { useStore } from './store'

export default function Preset() {
  const updateState = useStore((state) => state.updateState)
  return (
    <Box sx={{ padding: 2 }}>
      {Registry.listGroups().map((Group) => (
        <Box key={Group.title}>
          <Typography variant="h5">{Group.title}</Typography>
          {Registry.listPresetsInGroup(Group.type).map((Preset: any) => (
            <Box key={Preset.type} sx={{ paddingY: 2 }}>
              <img
                src={Preset.image}
                width="100px"
                onClick={() => updateState({ preset: Preset.type })}
                style={{ cursor: 'pointer' }}
              />
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  )
}
