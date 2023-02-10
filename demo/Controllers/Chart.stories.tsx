import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Client } from '../../src/client'
import Chart from '../../src/components/Controllers/Chart'

export default {
  title: 'Controllers/Chart',
  component: Chart,
} as Meta

const Template: Story<Parameters<typeof Chart>[0]> = (args) => <Chart {...args} />

// Stories

export const Default = Template.bind({})
Default.args = {
  client: new Client({ session: 'storybooktestersession' }),
}
