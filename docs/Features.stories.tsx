import React from 'react'
import { Story, Meta } from '@storybook/react'
import Features from '../src/components/Features'

export default {
  title: 'Components/Features',
  component: Features,
} as Meta

const Template: Story = (args) => <Features {...args} />

export const Default = Template.bind({})
Default.args = {
  onSave: (features: any) => console.log(features),
}
