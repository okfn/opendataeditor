import * as React from 'react'
import FileContent from './Contents/FileContent'
import MetadataContent from './Contents/MetadataContent'
import PackageContent from './Contents/PackageContent'
import TableContent from './Contents/TableContent'
import TextContent from './Contents/TextContent'
import * as settings from '../../settings'
import { useStore } from './store'

const TEXT_FORMATS = ['csv', 'txt', 'md']
const METADATA_FORMATS = ['json', 'yaml']

export default function Content() {
  const record = useStore((state) => state.record)
  if (!record) return null
  switch (record.type) {
    case 'table':
      return <TableContent />
    case 'file':
      if (record.path === settings.PACKAGE_PATH) return <PackageContent />
      if (METADATA_FORMATS.includes(record.resource.format)) return <MetadataContent />
      if (TEXT_FORMATS.includes(record.resource.format)) return <TextContent />
      return <FileContent />
    default:
      return null
  }
}
