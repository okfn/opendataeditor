import React from 'react'
import { Story, Meta } from '@storybook/react'
import Test from '../src/components/Test'

export default {
  title: 'Components/Test',
  component: Test,
} as Meta

const Template: Story<Parameters<typeof Test>[0]> = (args) => <Test {...args} />

export const Default = Template.bind({})
Default.args = {
  name1: 'name1',
  name2: 'name2',
}
