import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Client } from '../../src/client'
import View from '../../src/components/Controllers/View'

export default {
  title: 'Controllers/View',
  component: View,
} as Meta

const Template: Story<Parameters<typeof View>[0]> = (args) => <View {...args} />

// Props

const client = new Client({ session: 'storybooktestersession' })

// Stories

export const Default = Template.bind({})
Default.args = {
  client,
}
