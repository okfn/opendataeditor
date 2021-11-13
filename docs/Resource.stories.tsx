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
  resource: {
    path: 'table.csv',
    name: 'table',
    scheme: 'file',
    format: 'csv',
    hashing: 'md5',
    encoding: 'utf-8',
    schema: {
      fields: [],
    },
    stats: {
      hash: 'hash',
      bytes: 30,
      fields: 2,
      rows: 2,
    },
  },
  onSave: (resource: any) => console.log(resource),
}
