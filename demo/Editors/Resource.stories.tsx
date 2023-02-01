import React from 'react'
import { Story, Meta } from '@storybook/react'
import Resource from '../../src/components/Editors/Resource'

export default {
  title: 'Editors/Resource',
  component: Resource,
} as Meta

const Template: Story<Parameters<typeof Resource>[0]> = (args) => <Resource {...args} />

const descriptor = {
  name: 'table',
  type: 'table',
  path: 'table.csv',
  scheme: 'file',
  format: 'csv',
  encoding: 'utf-8',
  mediatype: 'text/csv',
  schema: {
    fields: [],
  },
  stats: {
    md5: 'hash',
    sha256: 'hash',
    bytes: 30,
    fields: 2,
    rows: 2,
  },
}
export const Default = Template.bind({})
Default.args = {
  descriptor,
  onCommit: (resource: any) => console.log(resource),
  onRevert: (resource: any) => console.log(resource),
}
export const WithTabs = Template.bind({})
WithTabs.args = {
  withTabs: true,
  descriptor,
  onCommit: (resource: any) => console.log(resource),
  onRevert: (resource: any) => console.log(resource),
}
