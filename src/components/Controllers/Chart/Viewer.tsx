import * as React from 'react'
import Box from '@mui/material/Box'
import { VegaLite } from 'react-vega'
import { useStore } from './store'

// To understand how we make it fit the screen read:
// https://github.com/vega/react-vega/issues/85

export default function Viewer() {
  const panel = useStore((state) => state.panel)
  const rendered = useStore((state) => state.rendered)
  React.useEffect(() => {
    // To update the size of the chart:
    // https://vega.github.io/vega-lite/docs/size.html#specifying-responsive-width-and-height
    window.dispatchEvent(new Event('resize'))
  }, [panel])
  if (!rendered) return null
  return (
    <Box
      sx={{
        padding: 2,
        height: '100%',
        '& .vega-embed': { width: '100%', height: '100%' },
      }}
    >
      <VegaLite
        renderer="svg"
        spec={{ ...rendered, width: 'container', height: 'container' } as any}
      />
    </Box>
  )
}
