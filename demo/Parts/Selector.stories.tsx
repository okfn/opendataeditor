import React from 'react'
import { Story, Meta } from '@storybook/react'
import Selector from '../../src/components/Parts/Selector'

export default {
  title: 'Parts/Selector',
  component: Selector,
} as Meta

const Template: Story<Parameters<typeof Selector>[0]> = (args) => <Selector {...args} />

export const Default = Template.bind({})
Default.args = {
  items: ['path1.csv', 'path2.csv', 'path3.csv'],
  onSelect: console.log,
  onCancel: console.log,
}
