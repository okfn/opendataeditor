import React from 'react'
import { Story, Meta } from '@storybook/react'
import Test from '../../src/components/Views/Test'

export default {
  title: 'Views/Test',
  component: Test,
} as Meta

const Template: Story<Parameters<typeof Test>[0]> = (args) => <Test {...args} />

export const Default = Template.bind({})
Default.args = {}
