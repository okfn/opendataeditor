import React from 'react'
import { Story, Meta } from '@storybook/react'
import Resource from '../../src/components/Editors/Resource'

export default {
  title: 'Editors/Resource',
  component: Resource,
} as Meta

const Template: Story<Parameters<typeof Resource>[0]> = (args) => <Resource {...args} />

// Props

const resource = {
  name: 'table',
  type: 'table',
  path: 'table.csv',
}

// Stories

export const Default = Template.bind({})
Default.args = {
  resource,
  onChange: console.log,
}
