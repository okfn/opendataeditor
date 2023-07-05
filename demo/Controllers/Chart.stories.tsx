import { Meta, StoryObj } from '@storybook/react'
import { Client } from '../../src/client'
import ChartController from '../../src/client/components/Controllers/Chart'

type Story = StoryObj<typeof ChartController>
const meta: Meta<typeof ChartController> = {
  component: ChartController,
}

export default meta

// Data

const path = 'chart.json'
const client = new Client()

// Stories

export const Default: Story = {
  args: {
    path,
    client,
  },
}
