import React from 'react'
import { Story, Meta } from '@storybook/react'
import Package from '../../src/client/components/Editors/Package'

export default {
  title: 'Editors/Package',
  component: Package,
} as Meta

const Template: Story<Parameters<typeof Package>[0]> = (args) => <Package {...args} />

// Props

const pkg = {
  resources: [],
}

// Stories

export const Default = Template.bind({})
Default.args = {
  package: pkg,
  onChange: console.log,
}
