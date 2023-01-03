import * as React from 'react'
import Box from '@mui/material/Box'
import Package from '../../Views/Package'
import Resource from '../../Views/Resource'
import Dialect from '../../Views/Dialect'
import Schema from '../../Views/Schema'
import Checklist from '../../Views/Checklist'
import Pipeline from '../../Views/Pipeline'
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
            const { paths } = await client.projectListFiles()
            for (const resource of (descriptor as IPackage).resources) {
              for (const [index, path] of paths.entries()) {
                if (resource.path === path) delete paths[index]
              }
            }
            return paths
          }}
          loadResource={async (path) => {
            const { record } = await client.projectCreateRecord({ path })
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
