import { Meta, StoryObj } from '@storybook/react'
import { Client } from '../../src/client'
import ViewController from '../../src/client/components/Controllers/View'

type Story = StoryObj<typeof ViewController>
const meta: Meta<typeof ViewController> = {
  component: ViewController,
}

export default meta

// Data

const path = 'view.json'
const client = new Client()

// Stories

export const Default: Story = {
  args: {
    path,
    client,
  },
}
