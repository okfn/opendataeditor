import { $, expect } from '@wdio/globals'
import path from 'node:path'

describe('ODE basic workflow', () => {
    it('displays welcomming screen and FocusTrap exist until user clicks Get Started', async () => {
        // ODE has a Loading window and a main Window. We need to switch to the main one.
        const handles = await browser.getWindowHandles()
        await browser.switchToWindow(handles[0])

        // Calling browser.react$(...) will fail to find the root element. So we find it explicitly.
        // https://github.com/baruchvlz/resq/issues/31#issuecomment-493760156
        const root = await $('#root')
        const banner = await root.react$('WelcomeBanner')
        await expect(banner).toHaveText(expect.stringContaining('Welcome to the Open Data Editor!'))

        const simpleButton = await root.react$('SimpleButton', {props: {label: 'Get started'}})
        const focusTrap = await root.react$('FocusTrap')
        const addButton = await $('div.MuiGrid-grid-md-4:nth-child(1)') // react$('AddButton') has problems when using toBeClickable. Using CSS selector instead.

        await expect(focusTrap).toExist()
        await expect(addButton).not.toBeClickable()
        simpleButton.click()
        await expect(focusTrap).not.toExist()
        await expect(addButton).toBeClickable()

    }),
    it('uploads a csv file, file navigator adds an node, and the file content gets display', async() => {
      const filePath = path.join(__dirname, '../data/valid.csv')
      const remoteFilePath = await browser.uploadFile(filePath)
      const root = await $('#root')

      // Using CSS selector since react$('AddButton') is not clickable
      await root.$('div.MuiGrid-grid-md-4:nth-child(1) > div:nth-child(1) > button:nth-child(1)').click()
      // Adding the file to the hidden input[type=file] will trigger a server upload
      await $('label.MuiButton-fullWidth > input:nth-child(2)').addValue(remoteFilePath)

      const fileTreeNode = await root.react$('TreeNode', {props: {label: 'valid.csv'}})
      await expect(fileTreeNode).toExist()
      const tableEditor = await root.react$('TableEditor')
      await expect(tableEditor).toExist()
      // Calling tableEditor.toHaveText() fails (library bug?), get the element without using react$ selector
      const dataGrid = await $('.InovuaReactDataGrid')
      await expect(dataGrid).toHaveText(expect.stringContaining('Renault'))

      // We need to close the window for the FastAPI server to be closed and the port freed.
      browser.closeWindow()
    })
})

