import * as React from 'react'
import Box from '@mui/material/Box'
import Package from '../../Editors/Package'
import { IPackage } from '../../../interfaces'
// import { useTheme } from '@mui/material/styles'
import { useStore } from './store'

export default function Content() {
  // const theme = useTheme()
  const client = useStore((state) => state.client)
  const path = useStore((state) => state.file.path)
  const descriptor = useStore((state) => state.descriptor)
  const loadDescriptor = useStore((state) => state.loadDescriptor)
  React.useEffect(() => {
    loadDescriptor().catch(console.error)
  }, [path])
  if (!descriptor) return null
  return (
    <Box sx={{ paddingX: 2 }}>
      <Package
        client={client}
        package={descriptor as IPackage}
        loadPaths={async () => {
          const { items } = await client.fileList()
          for (const resource of (descriptor as IPackage).resources) {
            for (const [index, item] of items.entries()) {
              if (resource.path === item.path) delete items[index]
            }
          }
          return items.map((item) => item.path)
        }}
        loadResource={async (path) => {
          const { file } = await client.fileRead({ path })
          // @ts-ignore
          const { resource } = file.record
          return resource
        }}
      />
    </Box>
  )
}
