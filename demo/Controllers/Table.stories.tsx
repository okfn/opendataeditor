import { Meta, StoryObj } from '@storybook/react'
import { Client } from '../../src/client'
import TableController from '../../src/client/components/Controllers/Table'

type Story = StoryObj<typeof TableController>
const meta: Meta<typeof TableController> = {
  component: TableController,
}

export default meta

// Data

const path = 'table.csv'
const client = new Client()

// Stories

export const Default: Story = {
  args: {
    path,
    client,
  },
}
