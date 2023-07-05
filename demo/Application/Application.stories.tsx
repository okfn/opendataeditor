import { Meta, StoryObj } from '@storybook/react'
import { Client } from '../../src/client'
import Application from '../../src/client/components/Application'

type Story = StoryObj<typeof Application>
const meta: Meta<typeof Application> = {
  title: 'Application/Application',
  component: Application,
}

export default meta

// Data

const client = new Client()

// Stories

export const Default: Story = {
  args: {
    client,
  },
}
