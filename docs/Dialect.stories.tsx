import React from 'react'
import { Story, Meta } from '@storybook/react'
import Dialect from '../src/components/Dialect'

export default {
  title: 'Components/Dialect',
  component: Dialect,
} as Meta

const Template: Story<Parameters<typeof Dialect>[0]> = (args) => <Dialect {...args} />

export const Default = Template.bind({})
Default.args = {
  descriptor: {
    header: true,
    headerRows: [1],
    delimiter: ',',
  },
  handleCommit: (dialect: any) => console.log(dialect),
  handleRevert: (dialect: any) => console.log(dialect),
}
