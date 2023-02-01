import React from 'react'
import { Story, Meta } from '@storybook/react'
import Package from '../../src/components/Editors/Package'

export default {
  title: 'Editors/Package',
  component: Package,
} as Meta

const Template: Story<Parameters<typeof Package>[0]> = (args) => <Package {...args} />

const dp = {
  name: 'name',
  title: 'title',
  description: 'description',
  homepage: 'homepage',
  resources: [{ type: 'table' }],
  contributors: [],
}
export const Default = Template.bind({})
Default.args = {
  package: dp,
  onCommit: (dp: any) => console.log(dp),
  onRevert: (dp: any) => console.log(dp),
}
export const WithTabs = Template.bind({})
WithTabs.args = {
  withTabs: true,
  package: dp,
  onCommit: (dp: any) => console.log(dp),
  onRevert: (dp: any) => console.log(dp),
}
