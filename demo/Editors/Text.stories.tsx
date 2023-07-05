import { Meta, StoryObj } from '@storybook/react'
import TextEditor from '../../src/client/components/Editors/Text'

type Story = StoryObj<typeof TextEditor>
const meta: Meta<typeof TextEditor> = {
  component: TextEditor,
}

export default meta

// Data

const value = 'Hello World!'

// Stories

export const Default: Story = {
  args: {
    value,
    height: '100vh',
    onChange: console.log,
  },
}
