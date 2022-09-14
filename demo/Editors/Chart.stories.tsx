import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Client } from '../../src/client'
import Chart from '../../src/components/Editors/Chart'

export default {
  title: 'Editors/Chart',
  component: Chart,
} as Meta

const Template: Story<Parameters<typeof Chart>[0]> = (args) => <Chart {...args} />

export const Default = Template.bind({})
Default.args = {
  client: new Client({ session: '0ZboLklNFmEyRnUSnMgtMg' }),
}
