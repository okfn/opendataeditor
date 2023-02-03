import * as React from 'react'
import Box from '@mui/material/Box'
import Package from '../../Editors/Package'
import Resource from '../../Editors/Resource'
import Dialect from '../../Editors/Dialect'
import Schema from '../../Editors/Schema'
import Checklist from '../../Editors/Checklist'
import Pipeline from '../../Editors/Pipeline'
import { IPackage, IResource, ISchema } from '../../../interfaces'
// import { useTheme } from '@mui/material/styles'
import { useStore } from './store'

export default function Content() {
  // const theme = useTheme()
  const type = useStore((state) => state.type)
  const client = useStore((state) => state.client)
  const path = useStore((state) => state.record.path)
  const descriptor = useStore((state) => state.descriptor)
  const loadDescriptor = useStore((state) => state.loadDescriptor)
  React.useEffect(() => {
    loadDescriptor().catch(console.error)
  }, [path])
  if (!descriptor) return null
  return (
    <Box sx={{ paddingX: 2 }}>
      {type === 'package' && (
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
            const { record } = await client.resourceCreate({ path })
            const { resource } = record
            return resource
          }}
        />
      )}
      {type === 'resource' && <Resource resource={descriptor as IResource} />}
      {type === 'dialect' && <Dialect dialect={descriptor} />}
      {type === 'schema' && <Schema schema={descriptor as ISchema} />}
      {type === 'checklist' && <Checklist checklist={descriptor} />}
      {type === 'pipeline' && <Pipeline pipeline={descriptor} />}
    </Box>
  )
}
