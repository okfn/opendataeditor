import React from 'react'
import { Story, Meta } from '@storybook/react'
import Package from '../../src/components/Views/Package'

export default {
  title: 'Views/Package',
  component: Package,
} as Meta

const Template: Story<Parameters<typeof Package>[0]> = (args) => <Package {...args} />

const descriptor = {
  name: 'name',
  title: 'title',
  description: 'description',
  homepage: 'homepage',
  resources: [],
}
export const Default = Template.bind({})
Default.args = {
  descriptor,
  onCommit: (pkg: any) => console.log(pkg),
  onRevert: (pkg: any) => console.log(pkg),
}
export const WithTabs = Template.bind({})
WithTabs.args = {
  withTabs: true,
  descriptor,
  onCommit: (pkg: any) => console.log(pkg),
  onRevert: (pkg: any) => console.log(pkg),
}
