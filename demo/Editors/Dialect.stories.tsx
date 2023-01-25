import React from 'react'
import { Story, Meta } from '@storybook/react'
import Dialect from '../../src/components/Editors/Dialect'

export default {
  title: 'Editors/Dialect',
  component: Dialect,
} as Meta

const Template: Story<Parameters<typeof Dialect>[0]> = (args) => <Dialect {...args} />

export const Default = Template.bind({})
Default.args = {
  descriptor: {
    header: true,
    headerRows: [1],
    csv: { delimiter: ';' },
  },
  onCommit: (dialect: any) => console.log(dialect),
  onRevert: (dialect: any) => console.log(dialect),
}
