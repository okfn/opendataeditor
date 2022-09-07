import React from 'react'
import { Story, Meta } from '@storybook/react'
import Package from '../src/components/Package'

export default {
  title: 'Components/Package',
  component: Package,
} as Meta

const Template: Story<Parameters<typeof Package>[0]> = (args) => <Package {...args} />

export const Default = Template.bind({})
Default.args = {
  descriptor: {
    name: 'name',
    title: 'title',
    description: 'description',
    homepage: 'homepage',
  },
  onCommit: (descriptor: any) => console.log(descriptor),
  onRevert: (descriptor: any) => console.log(descriptor),
}
