import * as React from 'react'
import { ResourceControllerProps } from '../../Parts/Controller/Resource'
import File from '../../Controllers/File'
import Package from '../../Controllers/Package'
import Metadata from '../../Controllers/Metadata'
import Chart from '../../Controllers/Chart'
import Table from '../../Controllers/Table'
import Text from '../../Controllers/Text'
import View from '../../Controllers/View'

export const RESOURCE_CONTROLLERS: {
  [type: string]: React.ElementType<ResourceControllerProps>
} = {
  chart: Chart,
  file: File,
  json: Text,
  metadata: Metadata,
  package: Package,
  table: Table,
  text: Text,
  view: View,
}
