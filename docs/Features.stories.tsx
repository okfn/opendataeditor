import React from 'react'
import { Story, Meta } from '@storybook/react'
import Features from '../src/components/Features'

export default {
  title: 'Components/Features',
  component: Features,
} as Meta

const Template: Story<Parameters<typeof Features>[0]> = (args) => <Features {...args} />

export const Default = Template.bind({})
Default.args = {
  features: {
    layout: { header: true, headerRows: [1] },
    dialect: { code: 'csv', delimiter: ',' },
    control: { code: 'local' },
  },
  onSave: (features: any) => console.log(features),
}
