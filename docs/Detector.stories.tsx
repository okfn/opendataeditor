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
  detector: { bufferSize: 10000, sampleSize: 100 },
  onSave: (detector: any) => console.log(detector),
}
