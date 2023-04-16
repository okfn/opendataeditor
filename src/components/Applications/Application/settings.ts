import * as React from 'react'
import ControllerProps from '../../Parts/Controller/Props'
import File from '../../Controllers/File'
import Package from '../../Controllers/Package'
import Metadata from '../../Controllers/Metadata'
import Chart from '../../Controllers/Chart'
import Table from '../../Controllers/Table'
import Text from '../../Controllers/Text'
import View from '../../Controllers/View'

export const CONTROLLERS: {
  [type: string]: React.ElementType<ControllerProps>
} = {
  chart: Chart,
  dialect: Metadata,
  file: File,
  json: Text,
  package: Package,
  resource: Metadata,
  schema: Metadata,
  table: Table,
  text: Text,
  view: View,
}
