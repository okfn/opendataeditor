import React from 'react'
import { Story, Meta } from '@storybook/react'
import Resource from '../src/components/Resource'

export default {
  title: 'Components/Resource',
  component: Resource,
} as Meta

const Template: Story<Parameters<typeof Resource>[0]> = (args) => <Resource {...args} />

export const Default = Template.bind({})
Default.args = {
  descriptor: {
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
  },
  onCommit: (resource: any) => console.log(resource),
  onRevert: (resource: any) => console.log(resource),
}
