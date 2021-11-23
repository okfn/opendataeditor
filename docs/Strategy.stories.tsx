import React from 'react'
import { Story, Meta } from '@storybook/react'
import Strategy from '../src/components/Strategy'

export default {
  title: 'Components/Strategy',
  component: Strategy,
} as Meta

const Template: Story<Parameters<typeof Strategy>[0]> = (args) => <Strategy {...args} />

export const Default = Template.bind({})
Default.args = {
  descriptor: { bufferSize: 10000, sampleSize: 100 },
  onSave: (strategy: any) => console.log(strategy),
}
