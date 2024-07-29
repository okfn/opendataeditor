import { $, expect } from '@wdio/globals'

describe('Electron Testing', () => {
    it.skip('should display loader on start', async () => {
        const handles = await browser.getWindowHandles()
        await browser.switchToWindow(handles[0])
        const header = $('.loader')
        await expect(header).toExist()
    })
    it('should display Open Data Editor on header', async () => {
        const handles = await browser.getWindowHandles()
        await browser.switchToWindow(handles[0])
        const header = $('header')
        await expect(header).toHaveText(expect.stringContaining('Open Data Editor'))
    })
})

