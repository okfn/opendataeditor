import React from 'react'
import { Story, Meta } from '@storybook/react'
import Detector from '../src/components/Detector'

export default {
  title: 'Components/Detector',
  component: Detector,
} as Meta

const Template: Story = (args) => <Detector {...args} />

export const Default = Template.bind({})
Default.args = {}
