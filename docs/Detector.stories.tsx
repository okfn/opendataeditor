import React from 'react'
import { Story, Meta } from '@storybook/react'
import Detector from '../src/components/Detector'

export default {
  title: 'Components/Detector',
  component: Detector,
} as Meta

const Template: Story<Parameters<typeof Detector>[0]> = (args) => <Detector {...args} />

export const Default = Template.bind({})
Default.args = {
  descriptor: { bufferSize: 10000, sampleSize: 100 },
  onCommit: (detector: any) => console.log(detector),
}
