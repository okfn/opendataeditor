import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Client } from '../src/client'
import Dataset from '../src/components/Dataset'

export default {
  title: 'Components/Dataset',
  component: Dataset,
} as Meta

const Template: Story<Parameters<typeof Dataset>[0]> = (args) => <Dataset {...args} />

export const Default = Template.bind({})
Default.args = {
  client: new Client({ session: '0ZboLklNFmEyRnUSnMgtMg' }),
  path: 'table.csv',
}
